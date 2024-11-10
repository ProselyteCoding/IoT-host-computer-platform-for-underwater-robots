import paho.mqtt.client as mqtt
import random
import time
import threading

# MQTT服务器设置
broker = "172.6.0.240"  # MQTT代理地址
port = 1883  # MQTT代理端口
topic_sensor = "sensor/data"
topic_control = "control/movement"

# 传感器值
temperature = 0.0
pressure = 0.0
depth = 0.0


def publish_sensor_data():
    global temperature, pressure, depth
    client = mqtt.Client()
    client.connect(broker, port)

    while True:
        # 模拟传感器数据
        temperature = round(random.uniform(15.0, 30.0), 2)  # 温度范围 15-30℃
        pressure = round(random.uniform(95.0, 105.0), 2)  # 气压范围 95-105 KPa
        depth = round(random.uniform(0.0, 10.0), 2)  # 深度范围 0-10 M

        # 发布传感器数据
        payload = (
            f"Temperature: {temperature} °C, Pressure: {pressure} kPa, Depth: {depth} m"
        )
        client.publish(topic_sensor, payload)
        print(f"Published: {payload}")
        time.sleep(1)


def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()} on topic {msg.topic}")


def subscribe_control_signals():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(broker, port)
    client.subscribe(topic_control)
    client.loop_start()  # 启动循环以接收消息

    while True:
        time.sleep(1)  # 等待接收信号


if __name__ == "__main__":
    sensor_thread = threading.Thread(target=publish_sensor_data)
    sensor_thread.start()
    subscribe_control_signals()