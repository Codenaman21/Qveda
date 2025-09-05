# quantum_core/simulator.py
"""
QuantumSimulator
- Runs Qiskit circuits using Aer (or fallback) for statevector or qasm simulation.
- Optional simple noise models (depolarizing / bitflip) using Aer noise tools if available.
- Returns structured outputs: counts, probabilities, statevector, circuit metadata.
"""

from typing import Dict, Any, Optional
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector
import numpy as np
import warnings

# try to import noise tools. If not available, fallback gracefully
try:
    from qiskit_aer.noise import NoiseModel, depolarizing_error, pauli_error
    AER_NOISE_AVAILABLE = True
except Exception:
    AER_NOISE_AVAILABLE = False

from .workflow import QuantumWorkflow

class QuantumSimulator:
    def __init__(self, backend_name: str = "aer_simulator"):
        """
        Initialize simulator backend.
        Default is AerSimulator. If not available, fallback to local AerSimulator.
        """
        self.backend_name = backend_name
        try:
            self.simulator = AerSimulator()
        except Exception as e:
            raise RuntimeError(
                "AerSimulator not available. Install qiskit-aer."
            ) from e

    def _apply_noise_model(self, noise_spec: Optional[Dict[str, Any]] = None):
        """
        Construct a NoiseModel if noise_spec provided and Aer noise is available.
        noise_spec: {"mode": "depolarizing"|"bitflip", "p": 0.01}
        """
        if not noise_spec or noise_spec.get("mode", "none") == "none":
            return None
        if not AER_NOISE_AVAILABLE:
            warnings.warn("Aer noise tools not available; ignoring noise spec.")
            return None

        mode = noise_spec.get("mode")
        p = float(noise_spec.get("p", 0.0))
        nm = NoiseModel()

        if mode == "depolarizing":
            err1 = depolarizing_error(p, 1)
            err2 = depolarizing_error(p, 2)
            nm.add_all_qubit_quantum_error(err1, ["u1", "u2", "u3", "rx", "rz", "sx", "x", "h", "s", "t"])
            nm.add_all_qubit_quantum_error(err2, ["cx", "cz"])
        elif mode == "bitflip":
            err = pauli_error([("X", p), ("I", 1 - p)])
            nm.add_all_qubit_quantum_error(err, ["u1", "u2", "u3", "rx", "rz", "h", "x"])
        else:
            return None
        return nm

    def run_qasm(self, wf: QuantumWorkflow, shots: int = 1024, noise: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute the workflow as a QASM (measurement) simulation.
        Returns dict with counts, probabilities, metadata.
        """
        qc = wf.to_qiskit()

        # If no measurement present, measure all at end
        if not any(g["name"] == "MEASURE" for g in wf.gates):
            qc.measure(range(wf.num_qubits), range(wf.num_qubits))

        noise_model = self._apply_noise_model(noise)
        backend = self.simulator

        if noise_model:
            backend = AerSimulator(method="density_matrix")  # supports noise

        job = backend.run(qc, shots=shots, noise_model=noise_model) if noise_model else backend.run(qc, shots=shots)
        result = job.result()
        counts = result.get_counts()
        total = sum(counts.values())
        probabilities = {k: v / total for k, v in counts.items()}

        meta = {
            "shots": total,
            "depth": qc.depth(),
            "width": qc.width(),
            "gate_count": qc.count_ops(),
        }

        return {"counts": counts, "probabilities": probabilities, "meta": meta}

    def run_statevector(self, wf: QuantumWorkflow, noise: Optional[Dict[str, Any]] = None, shots: int = 1024) -> Dict[str, Any]:
        """
        Return the statevector of the circuit.
        If noise is provided, simulate multiple trajectories to approximate noisy state.
        """
        sc = QuantumCircuit(wf.num_qubits)
        for g in wf.gates:
            name, targets, controls, params = g["name"], g["targets"], g["controls"], g["params"]
            if name == "MEASURE": continue
            elif name == "H": [sc.h(t) for t in targets]
            elif name == "X": [sc.x(t) for t in targets]
            elif name == "Y": [sc.y(t) for t in targets]
            elif name == "Z": [sc.z(t) for t in targets]
            elif name == "S": [sc.s(t) for t in targets]
            elif name == "T": [sc.t(t) for t in targets]
            elif name == "RX": [sc.rx(float(params.get("theta",0)), t) for t in targets]
            elif name == "RY": [sc.ry(float(params.get("theta",0)), t) for t in targets]
            elif name == "RZ": [sc.rz(float(params.get("theta",0)), t) for t in targets]
            elif name in ("CX", "CNOT"):
                if controls and targets and len(controls)==len(targets):
                    for c,t in zip(controls, targets): sc.cx(c,t)
                elif len(targets)==2 and not controls:
                    sc.cx(targets[0], targets[1])
            elif name == "CCX":
                if len(controls)>=2 and len(targets)>=1:
                    sc.ccx(controls[0], controls[1], targets[0])

        if noise and AER_NOISE_AVAILABLE:
            noise_model = self._apply_noise_model(noise)
            backend = AerSimulator(method="density_matrix")
            job = backend.run(sc, shots=shots, noise_model=noise_model)
            result = job.result()
            # approximate statevector by averaging
            sv_list = []
            for i in range(shots):
                sv_list.append(Statevector(result.data(i)["density_matrix"]).data)
            vec = np.mean(sv_list, axis=0).tolist()
            probs = (np.abs(vec)**2).tolist()
        else:
            state = Statevector.from_instruction(sc)
            vec = state.data.tolist()
            probs = (np.abs(state.data)**2).tolist()

        return {"statevector": vec, "probabilities": probs, "meta": {"dim": len(vec)}}

    def estimate_resources(self, wf: QuantumWorkflow) -> Dict[str, Any]:
        """Estimate simple resources: gate counts, depth, width."""
        qc = wf.to_qiskit()
        return {
            "depth": qc.depth(),
            "width": qc.width(),
            "gate_count": qc.count_ops(),
        }
