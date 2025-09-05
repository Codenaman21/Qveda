# main.py  (robust, tolerant version)
from quantum_core import QuantumWorkflow, QuantumSimulator, QuantumParser
import json
import traceback

def try_build_workflow(wf_json):
    """
    Try multiple ways to build a QuantumWorkflow so main.py works with either:
    - QuantumWorkflow(num_qubits)
    - QuantumWorkflow(dict)  (if implemented)
    - QuantumWorkflow.from_dict / from_json (if provided)
    """
    # 1) Try passing the whole dict (some versions support this)
    try:
        wf = QuantumWorkflow(wf_json)
        # sanity check
        if hasattr(wf, "to_qiskit"):
            return wf
    except Exception:
        pass

    # 2) Try classmethod from_dict / from_json if available
    try:
        if hasattr(QuantumWorkflow, "from_dict"):
            wf = QuantumWorkflow.from_dict(wf_json)
            return wf
        if hasattr(QuantumWorkflow, "from_json"):
            wf = QuantumWorkflow.from_json(json.dumps(wf_json))
            return wf
    except Exception:
        pass

    # 3) Fallback: create with num_qubits and add gates manually
    try:
        num_qubits = wf_json.get("qubits") or wf_json["qubits"]
    except Exception:
        raise RuntimeError("Workflow JSON missing 'qubits' key; cannot build workflow.")

    wf = QuantumWorkflow(num_qubits)  # most likely signature
    for g in wf_json.get("gates", []):
        # ensure keys exist
        name = g.get("name")
        targets = g.get("targets", []) or []
        controls = g.get("controls", []) or []
        params = g.get("params", {}) or {}
        wf.add_gate(name, targets=targets, controls=controls, params=params)
    return wf


def safe_qasm_from_circuit(qc):
    """Try multiple ways to get a QASM string from a QuantumCircuit, return None if not available."""
    if qc is None:
        return None
    try:
        # some qiskit versions have qc.qasm()
        return qc.qasm()
    except Exception:
        pass
    try:
        # try to export via to_qasm (older/newer variants)
        return qc.qasm(formatted=False)
    except Exception:
        pass
    return None


def pretty_print_meta(meta: dict):
    if not meta:
        print("  (no metadata)")
        return
    for k, v in meta.items():
        print(f"  {k}: {v}")


def main():
    # Example workflow JSON (Bell state)
    wf_json = {
        "qubits": 2,
        "gates": [
            {"name": "H", "targets": [0], "controls": [], "params": {}},
            {"name": "CX", "targets": [1], "controls": [0], "params": {}},
            {"name": "MEASURE", "targets": [0, 1], "controls": [], "params": {}}
        ],
        "meta": {}
    }

    print("=== Building workflow (robust) ===")
    try:
        wf = try_build_workflow(wf_json)
    except Exception as e:
        print("Failed to build workflow:", e)
        traceback.print_exc()
        return

    # Get a QuantumCircuit object for fallback displays
    try:
        qc = wf.to_qiskit()
    except Exception:
        qc = None

    print("Workflow built. Proceeding to simulations...\n")

    # Initialize simulator
    sim = QuantumSimulator()

    # ----- QASM simulation -----
    print("=== QASM simulation ===")
    try:
        qasm_result = sim.run_qasm(wf, shots=1024)
    except Exception as e:
        print("run_qasm raised an exception:")
        traceback.print_exc()
        qasm_result = {}

    print("Counts:", qasm_result.get("counts"))
    print("Probabilities:", qasm_result.get("probabilities"))
    print("Metadata:")
    pretty_print_meta(qasm_result.get("meta", {}))
    print()

    # ----- Statevector simulation -----
    print("=== Statevector simulation ===")
    try:
        state_result = sim.run_statevector(wf)
    except Exception as e:
        print("run_statevector raised an exception:")
        traceback.print_exc()
        state_result = {}

    print("Statevector:", state_result.get("statevector"))
    print("Probabilities:", state_result.get("probabilities"))
    print("Metadata:")
    pretty_print_meta(state_result.get("meta", {}))
    print()

    # ----- Noisy QASM simulation -----
    print("=== Noisy QASM simulation ===")
    noise_spec = {"mode": "depolarizing", "p": 0.01}
    try:
        noisy_result = sim.run_qasm(wf, shots=1024, noise=noise_spec)
    except Exception as e:
        print("run_qasm (noisy) raised an exception:")
        traceback.print_exc()
        noisy_result = {}

    print("Counts:", noisy_result.get("counts"))
    print("Probabilities:", noisy_result.get("probabilities"))
    print("Metadata:")
    pretty_print_meta(noisy_result.get("meta", {}))
    print()

    # ----- Parser step (robust) -----
    print("=== Parser / circuit display ===")
    qasm_code = None

    # Prefer simulator-provided qasm if present
    if isinstance(qasm_result, dict):
        qasm_code = qasm_result.get("qasm")

    # If simulator didn't return qasm, try to derive from qc or wf
    if not qasm_code:
        qasm_code = safe_qasm_from_circuit(qc)

    if qasm_code:
        try:
            parser = QuantumParser(qasm_code)   # your parser expects qasm string in constructor
            parsed_circuit = parser.parse()
            print("Parsed QuantumCircuit (from QASM):")
            try:
                print(parsed_circuit.draw("text"))
            except Exception:
                print(parsed_circuit)
            print("\nParsed Metadata:")
            pretty_print_meta(parser.get_metadata())
        except Exception:
            print("Parser failed to parse QASM. Falling back to drawing the circuit object.")
            traceback.print_exc()
            if qc is not None:
                try:
                    print(qc.draw("text"))
                except Exception:
                    print(qc)
            else:
                print("(No QuantumCircuit available to show.)")
    else:
        # Final fallback: just print the Qiskit circuit and metadata we already have
        print("QASM not available from simulator or QuantumCircuit.qasm(); showing circuit directly:")
        if qc is not None:
            try:
                print(qc.draw("text"))
            except Exception:
                print(qc)
            # Try to print metadata about qc
            try:
                meta = {
                    "num_qubits": getattr(qc, "num_qubits", None),
                    "num_clbits": getattr(qc, "num_clbits", None),
                    "depth": qc.depth(),
                    "width": qc.width(),
                    "gate_count": qc.count_ops()
                }
                print("\nCircuit metadata:")
                pretty_print_meta(meta)
            except Exception:
                pass
        else:
            print("(No QuantumCircuit available to show.)")

    print("\n=== Done ===")


if __name__ == "__main__":
    main()
