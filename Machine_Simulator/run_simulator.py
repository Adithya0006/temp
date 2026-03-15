# run_simulator.py

import time
from smt_line import build_smt_line


def run():

    print("\nStarting SMT Pipeline Simulator...\n")

    # Build SMT line
    loader_queue = build_smt_line()

    pcb_counter = 0

    while True:

        # Generate PCB ID
        pcb_counter += 1

        pcb_id = f"PCB{pcb_counter:04}"

        print(f"\nLoader introduced {pcb_id}")

        # Send PCB to loader machine
        loader_queue.put(pcb_id)

        # Wait before next PCB enters line
        time.sleep(3)


if __name__ == "__main__":
    run()