"""
Problem 42: Design Patterns - Factory Method Pattern
-----------------------------------------------------
Question:
Implement the Factory Method design pattern in Python to instantiate different notification 
services (`EmailNotification`, `SMSNotification`, `PushNotification`) dynamically based on client choice.
"""

from abc import ABC, abstractmethod

class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> str:
        pass

class EmailNotification(Notification):
    def send(self, message: str) -> str:
        return f"[EMAIL] Sending email: '{message}'"

class SMSNotification(Notification):
    def send(self, message: str) -> str:
        return f"[SMS] Sending SMS: '{message}'"

class PushNotification(Notification):
    def send(self, message: str) -> str:
        return f"[PUSH] Sending Push Notification: '{message}'"

class NotificationFactory:
    @staticmethod
    def create_notification(channel: str) -> Notification:
        channel_lower = channel.lower()
        if channel_lower == "email":
            return EmailNotification()
        elif channel_lower == "sms":
            return SMSNotification()
        elif channel_lower == "push":
            return PushNotification()
        else:
            raise ValueError(f"Unknown notification channel: {channel}")

def main():
    print("=== Factory Method Design Pattern Demo ===")
    channels = ["email", "sms", "push"]

    for ch in channels:
        notifier = NotificationFactory.create_notification(ch)
        status = notifier.send("Your order #1001 has shipped!")
        print(status)

if __name__ == "__main__":
    main()
