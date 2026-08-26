"""
Problem 06: Temperature Converter
---------------------------------
Question:
Write functions to convert temperature from Celsius to Fahrenheit and from 
Fahrenheit to Celsius using standard mathematical conversion formulas.
Formulas:
- Fahrenheit = (Celsius * 9/5) + 32
- Celsius = (Fahrenheit - 32) * 5/9
"""

def celsius_to_fahrenheit(celsius: float) -> float:
    return (celsius * 9 / 5) + 32

def fahrenheit_to_celsius(fahrenheit: float) -> float:
    return (fahrenheit - 32) * 5 / 9

def main():
    print("=== Temperature Converter ===")
    
    c_temp = 37.0
    f_result = celsius_to_fahrenheit(c_temp)
    print(f"{c_temp}°C is equal to {f_result:.2f}°F")

    f_temp = 98.6
    c_result = fahrenheit_to_celsius(f_temp)
    print(f"{f_temp}°F is equal to {c_result:.2f}°C")

if __name__ == "__main__":
    main()
