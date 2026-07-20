from scapy.all import sniff
import json
import datetime

log_file = "../backend/storage/alerts.json"


def process_packet(packet):

    alert = {
        "time": str(datetime.datetime.now()),
        "summary": packet.summary()
    }

    with open(log_file, "a") as f:
        json.dump(alert, f)
        f.write("\n")

    print(packet.summary())


print("EnergonX Packet Monitoring Started...")

sniff(prn=process_packet, store=False)
