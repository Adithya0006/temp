# smt_line.py

import queue
from machine_worker import MachineWorker


def build_smt_line():

    # Create queues between machines
    loader_queue = queue.Queue()
    printer_queue = queue.Queue()
    spi_queue = queue.Queue()
    pickplace_queue = queue.Queue()
    reflow_queue = queue.Queue()
    aoi_queue = queue.Queue()

    # Create machine workers
    loader = MachineWorker("LOADER", loader_queue, printer_queue)

    printer = MachineWorker("PRINTER", printer_queue, spi_queue)

    spi = MachineWorker("SPI", spi_queue, pickplace_queue)

    pickplace = MachineWorker("PICK_PLACE", pickplace_queue, reflow_queue)

    reflow = MachineWorker("REFLOW", reflow_queue, aoi_queue)

    aoi = MachineWorker("AOI", aoi_queue, None)

    # Start machine threads
    loader.start()
    printer.start()
    spi.start()
    pickplace.start()
    reflow.start()
    aoi.start()

    # Return loader queue to insert PCBs
    return loader_queue