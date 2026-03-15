from Machine_Simulator.machine_worker import Machine


class SPI(Machine):

    def __init__(self, machine_id, next_machine=None):

        super().__init__(machine_id, next_machine)

        # Counter for PCB IDs
        self.pcb_counter = 0

    def start_production(self):

        self.pcb_counter += 1

        pcb_id = f"PCB{self.pcb_counter:04}"

        print(f"\nLoader introduced {pcb_id}")

        self.process_pcb(pcb_id)