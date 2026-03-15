# machine_worker.py

import time
import random
import threading
from datetime import datetime
from telemetry import generate_telemetry
from telemetry import send_telemetry


class MachineWorker(threading.Thread):

    def __init__(self, machine_id, input_queue, output_queue=None):

        # Initialize parent Thread class
        super().__init__()

        # Machine name
        self.machine_id = machine_id

        # Queue from which machine receives PCB
        self.input_queue = input_queue

        # Queue to which machine sends PCB
        self.output_queue = output_queue

        # Allow thread to close when main program stops
        self.daemon = True

    def run(self):
        """
        Thread execution starts here
        """

        while True:

            # Wait until PCB arrives
            pcb_id = self.input_queue.get()

            # Record PCB start time
            start_time = datetime.now()

            print(f"\n{self.machine_id} started processing {pcb_id}")

            # Simulate machine processing time
            process_time = random.randint(2, 5)

            time.sleep(process_time)

            # Record PCB end time
            end_time = datetime.now()

            # Generate telemetry data
            telemetry = generate_telemetry(
                self.machine_id,
                pcb_id,
                start_time,
                end_time
            )

            # Print telemetry
            print("Machine Telemetry ->", telemetry)
            send_telemetry(telemetry)

            # Send PCB to next machine if exists
            if self.output_queue:
                self.output_queue.put(pcb_id)

            # Mark queue task done
            self.input_queue.task_done()