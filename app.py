from flask import Flask, request, jsonify
from flask_cors import CORS
from quantum_core.workflow import QuantumWorkflow
from quantum_core.simulator import QuantumSimulator
from quantum_core.ai_analysis import generate_ai_analysis
import time
import psutil
import os
import traceback
import numpy as np

app = Flask(__name__)
CORS(app)


# helper: convert complex numbers to JSON-serializable dict
def serialize_complex(obj):
    if isinstance(obj, complex):
        return {"real": obj.real, "imag": obj.imag}
    if isinstance(obj, list):
        return [serialize_complex(x) for x in obj]
    if isinstance(obj, dict):
        return {k: serialize_complex(v) for k, v in obj.items()}
    return obj


def compute_entanglement(statevector, num_qubits):
    try:
        vec = np.array([c["real"] + 1j * c["imag"]
                       if isinstance(c, dict) else c for c in statevector])
        vec = vec / np.linalg.norm(vec)

        dimA = 2 ** (num_qubits // 2)
        dimB = 2 ** (num_qubits - num_qubits // 2)
        psi_matrix = vec.reshape(dimA, dimB)

        # Schmidt coefficients
        U, S, Vh = np.linalg.svd(psi_matrix)
        schmidt_coeffs = (S / np.linalg.norm(S)).tolist()

        # Entropy
        probs = np.square(schmidt_coeffs)
        entropy = -np.sum([p * np.log2(p) for p in probs if p > 1e-12])

        # Fidelity with Bell states (if 2 qubits)
        fidelity = None
        bell_state = None
        if num_qubits == 2:
            bell_states = {
                "phi_plus": np.array([1/np.sqrt(2), 0, 0, 1/np.sqrt(2)]),
                "phi_minus": np.array([1/np.sqrt(2), 0, 0, -1/np.sqrt(2)]),
                "psi_plus": np.array([0, 1/np.sqrt(2), 1/np.sqrt(2), 0]),
                "psi_minus": np.array([0, 1/np.sqrt(2), -1/np.sqrt(2), 0]),
            }
            fids = {name: np.abs(np.vdot(b, vec)) ** 2 for name, b in bell_states.items()}
            bell_state, fidelity = max(fids.items(), key=lambda x: x[1])

        # Coherence time heuristic
        coherence_time = 50 * entropy  # µs

        # Reduced entanglement correlation matrix
        rho = np.outer(vec, np.conj(vec))
        matrix = rho.real[:num_qubits, :num_qubits].tolist()

        return {
            "entropy": float(entropy),
            "fidelity": float(fidelity) if fidelity is not None else None,
            "bell_state": bell_state,
            "coherence_time": float(coherence_time),
            "matrix": matrix,
            "schmidt": schmidt_coeffs
        }
    except Exception as e:
        print("❌ Entanglement computation failed:", e)
        return {
            "entropy": None,
            "fidelity": None,
            "bell_state": None,
            "coherence_time": None,
            "matrix": [],
            "schmidt": []
        }


@app.route("/simulate", methods=["POST"])
def simulate():
    try:
        data = request.get_json(force=True)
        print("🔎 Received JSON:", data)

        qubits = data.get("qubits")
        gates = data.get("gates", [])
        shots = data.get("shots", 1000)

        # Build workflow
        wf = QuantumWorkflow(num_qubits=qubits)
        wf.from_dict({"qubits": qubits, "gates": gates})

        # Run simulation
        sim = QuantumSimulator()

        # measure sim time
        start_time = time.perf_counter()
        qasm_result = sim.run_qasm(wf, shots=shots)
        statevector_result = sim.run_statevector(wf, shots=shots)
        resources = sim.estimate_resources(wf)
        end_time = time.perf_counter()
        simulation_time = (end_time - start_time) * 1000  # ms

        # memory usage
        process = psutil.Process(os.getpid())
        memory_usage = process.memory_info().rss / (1024 * 1024)  # MB

        # efficiency
        gate_counts = resources.get("gate_count", {})
        total_gates = sum(gate_counts.values()) if gate_counts else 1
        unique_gates = len(gate_counts)
        efficiency = unique_gates / total_gates if total_gates > 0 else 0.0

        # parallelization heuristic
        depth = resources.get("depth", 1)
        width = resources.get("width", 1)
        parallelization = width / depth if depth > 0 else 1.0

        # Entanglement
        entanglement_result = compute_entanglement(
            statevector_result.get("statevector", []), qubits
        )

        # AI analysis
        analysis = generate_ai_analysis(
            qubits,
            gates,
            qasm_result,
            statevector_result,
            entanglement_result
            )


        # Debug print to terminal
        print("✅ QASM Result:", qasm_result)
        print("✅ Statevector Result:", statevector_result)
        print("✅ Resource Estimate:", resources)

        response = {
            "counts": qasm_result.get("counts", {}),
            "probabilities": qasm_result.get("probabilities", {}),
            "statevector": serialize_complex(statevector_result.get("statevector", [])),
            "performance": {
                **serialize_complex(resources),
                "simulation_time": simulation_time,
                "memory_usage": memory_usage,
                "efficiency": efficiency,
                "parallelization": parallelization,
            },
            "entanglement": entanglement_result,
            "analysis": analysis,
        }

        print("📤 Final Response:", response)

        return jsonify(response)

    except Exception as e:
        print("❌ Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
