from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

content = """Smart Home Automation: Architecture and Scalability

Abstract:
This paper introduces a highly scalable architecture for Smart Home Automation using Edge Computing and React-based dashboards.

Methodology:
The system employs an ESP32 microcontroller as the central edge hub, running an MQTT broker for real-time sensor telemetries. The frontend is built with React and Vite, featuring a glassmorphism design system. A Node.js backend handles authentication and persistent data storage in MongoDB.

Results:
Performance tests indicate a latency of less than 20ms for device actuation commands, demonstrating robust real-time capabilities. The architecture seamlessly scaled to 50 concurrent smart devices without degrading dashboard responsiveness.

Conclusion:
Edge-based Smart Home systems offer significant latency and privacy benefits over cloud-dependent alternatives, making them ideal for modern deployments."""

pdf.multi_cell(0, 10, txt=content)
pdf.output("Demo_Research_Paper.pdf")
print("PDF generated successfully.")
