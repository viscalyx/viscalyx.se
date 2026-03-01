---
title: 'Syntax Highlighting Test'
date: '2025-04-08'
author: 'Blog Author'
excerpt: 'Testing different code block language syntax highlighting, including PowerShell.'
image: '/syntax-highlighting-test-multi-language-code-cover.png'
imageAlt: 'Syntax Highlighting Test cover with code snippets in multiple languages on a dark background.'
tags: ['syntax', 'highlighting', 'test']
category: 'Template'
readTime: '1 min read'
---

This article tests various code blocks with different languages and ensures
syntax highlighting works as expected without altering the current design or
background colors.

## JavaScript Example

```javascript
// JavaScript example
function greet(name) {
  console.log(`Hello, ${name}!`)
}
greet('World')
```
## Python Example

```python
# Python example
def add(a, b):
    return a + b

print(add(5, 3))
```
## PowerShell Example

```powershell
# PowerShell example
Param(
    [string]$name = 'World'
)
Write-Host "Hello, $name!"
```
## Bash Example

```bash
# Bash example
#!/bin/bash
for i in {1..5}; do
  echo "Iteration $i"
done
```
## HTML Example

```html
<!-- HTML example -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test</title>
  </head>
  <body>
    <h1>Syntax Highlighting Test</h1>
  </body>
</html>
```
## TypeScript Example

```typescript
// TypeScript example
interface User {
  id: number
  name: string
  email?: string
}

class UserService {
  private users: User[] = []

  addUser(user: User): void {
    this.users.push(user)
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id)
  }
}
```
## C# Example (Anchor Uniqueness Test)

```csharp
// C# example
using System;
using System.Collections.Generic;

public class Calculator
{
    public double Add(double a, double b)
    {
        return a + b;
    }

    public double Multiply(double a, double b)
    {
        return a * b;
    }
}

class Program
{
    static void Main()
    {
        var calc = new Calculator();
        Console.WriteLine($"5 + 3 = {calc.Add(5, 3)}");
    }
}
```
## C# Example

This second equally named section is to test unique anchoring when section has
same names.

```csharp
// C# example
using System;
using System.Collections.Generic;

public class Calculator
{
    public double Add(double a, double b)
    {
        return a + b;
    }

    public double Multiply(double a, double b)
    {
        return a * b;
    }
}

class Program
{
    static void Main()
    {
        var calc = new Calculator();
        Console.WriteLine($"5 + 3 = {calc.Add(5, 3)}");
    }
}
```
## Java Example

```java
// Java example
import java.util.ArrayList;
import java.util.List;

public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return String.format("Person{name='%s', age=%d}", name, age);
    }
}
```
## Go Example

```go
// Go example
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", handler)
    fmt.Println("Server starting on port 8080...")
    http.ListenAndServe(":8080", nil)
}
```
## Rust Example

```rust
// Rust example
use std::collections::HashMap;

#[derive(Debug)]
struct Student {
    name: String,
    grade: u8,
}

impl Student {
    fn new(name: String, grade: u8) -> Self {
        Student { name, grade }
    }

    fn is_passing(&self) -> bool {
        self.grade >= 60
    }
}

fn main() {
    let mut students = HashMap::new();

    students.insert(1, Student::new("Alice".to_string(), 85));
    students.insert(2, Student::new("Bob".to_string(), 72));

    for (id, student) in &students {
        println!("Student {}: {:?} - Passing: {}",
                 id, student, student.is_passing());
    }
}
```
## C++ Example

```cpp
// C++ example
#include <iostream>
#include <vector>
#include <algorithm>

class NumberProcessor {
private:
    std::vector<int> numbers;

public:
    void addNumber(int num) {
        numbers.push_back(num);
    }

    void sortNumbers() {
        std::sort(numbers.begin(), numbers.end());
    }

    void printNumbers() const {
        for (const auto& num : numbers) {
            std::cout << num << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    NumberProcessor processor;
    processor.addNumber(5);
    processor.addNumber(2);
    processor.addNumber(8);
    processor.sortNumbers();
    processor.printNumbers();

    return 0;
}
```
## PHP Example

<!-- markdownlint-disable MD013 -->
```php
<?php
// PHP example
class Database {
    private $host;
    private $username;
    private $password;
    private $database;
    private $connection;

    public function __construct($host, $username, $password, $database) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
    }

    public function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->database}";
            $this->connection = new PDO($dsn, $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return true;
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            return false;
        }
    }
}

$db = new Database('localhost', 'user', 'pass', 'mydb');
$db->connect();
?>
```
<!-- markdownlint-enable MD013 -->

## Ruby Example

```ruby
# Ruby example
class Book
  attr_accessor :title, :author, :pages

  def initialize(title, author, pages)
    @title = title
    @author = author
    @pages = pages
  end

  def description
    "#{@title} by #{@author} (#{@pages} pages)"
  end

  def long_book?
    @pages > 300
  end
end

# Usage
books = [
  Book.new("1984", "George Orwell", 328),
  Book.new("To Kill a Mockingbird", "Harper Lee", 281),
  Book.new("The Great Gatsby", "F. Scott Fitzgerald", 180)
]

books.each do |book|
  puts book.description
  puts "This is a long book!" if book.long_book?
  puts "---"
end
```
## Swift Example

```swift
// Swift example
import Foundation

protocol Animal {
    var name: String { get }
    func makeSound() -> String
}

struct Dog: Animal {
    let name: String
    let breed: String

    func makeSound() -> String {
        return "Woof!"
    }

    func fetch() -> String {
        return "\(name) is fetching the ball!"
    }
}

struct Cat: Animal {
    let name: String
    let isIndoor: Bool

    func makeSound() -> String {
        return "Meow!"
    }

    func purr() -> String {
        return "\(name) is purring contentedly."
    }
}

// Usage
let animals: [Animal] = [
    Dog(name: "Buddy", breed: "Golden Retriever"),
    Cat(name: "Whiskers", isIndoor: true)
]

for animal in animals {
    print("\(animal.name) says: \(animal.makeSound())")
}
```
## Kotlin Example

```kotlin
// Kotlin example
data class Person(val name: String, val age: Int)

class PersonRepository {
    private val people = mutableListOf<Person>()

    fun addPerson(person: Person) {
        people.add(person)
    }

    fun findPeopleByAge(age: Int): List<Person> {
        return people.filter { it.age == age }
    }

    fun getAverageAge(): Double {
        return if (people.isNotEmpty()) {
            people.map { it.age }.average()
        } else {
            0.0
        }
    }
}

fun main() {
    val repository = PersonRepository()

    repository.addPerson(Person("Alice", 25))
    repository.addPerson(Person("Bob", 30))
    repository.addPerson(Person("Charlie", 25))

    println("People aged 25: ${repository.findPeopleByAge(25)}")
    println("Average age: ${repository.getAverageAge()}")
}
```
## SQL Example

```sql
-- SQL example
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO employees (first_name, last_name, email, department, salary)
VALUES
    ('John', 'Doe', 'john.doe@example.com', 'Engineering', 75000.00),
    ('Jane', 'Smith', 'jane.smith@example.com', 'Marketing', 65000.00),
    ('Bob', 'Johnson', 'bob.johnson@example.com', 'Engineering', 80000.00);

SELECT
    department,
    AVG(salary) as avg_salary,
    COUNT(*) as employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 1
ORDER BY avg_salary DESC;
```
## CSS Example

```css
/* CSS example */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #333;
  --bg-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--bg-color);
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: darken(var(--primary-color), 10%);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .card {
    padding: 1rem;
  }
}
```
## YAML Example

```yaml
# YAML example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web-app
          image: nginx:1.21
          ports:
            - containerPort: 80
          env:
            - name: NODE_ENV
              value: 'production'
          resources:
            requests:
              memory: '64Mi'
              cpu: '250m'
            limits:
              memory: '128Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
```
## JSON Example

```json
{
  "name": "sample-project",
  "version": "1.0.0",
  "description": "A sample project configuration",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode=production"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21",
    "axios": "^0.27.0"
  },
  "devDependencies": {
    "jest": "^28.0.0",
    "nodemon": "^2.0.0",
    "webpack": "^5.70.0"
  },
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/sample-project.git"
  },
  "keywords": ["javascript", "node", "web", "api"]
}
```
## Docker Example

<!-- markdownlint-disable MD013 -->
```dockerfile
# Dockerfile example
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```
<!-- markdownlint-enable MD013 -->

## Regex Example

<!-- markdownlint-disable MD013 -->
```regex
# Regex examples

# Email validation
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

# Phone number (US format)
^\(\d{3}\)\s\d{3}-\d{4}$

# URL validation
^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$

# Password strength (8+ chars, uppercase, lowercase, number, special char)
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$

# IPv4 address
^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$

# Credit card number (basic format)
^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$
```
<!-- markdownlint-enable MD013 -->

## XML Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- XML example -->
<bookstore xmlns:fiction="http://example.com/fiction">
    <book id="1" category="fiction">
        <title lang="en">The Great Gatsby</title>
        <author>
            <first-name>F. Scott</first-name>
            <last-name>Fitzgerald</last-name>
        </author>
        <year>1925</year>
        <price currency="USD">12.99</price>
        <description>
            <![CDATA[
                A classic American novel set in the Jazz Age.
                It explores themes of wealth, love, and the American Dream.
            ]]>
        </description>
    </book>

    <book id="2" category="science">
        <title lang="en">A Brief History of Time</title>
        <author>
            <first-name>Stephen</first-name>
            <last-name>Hawking</last-name>
        </author>
        <year>1988</year>
        <price currency="USD">15.99</price>
        <topics>
            <topic>Cosmology</topic>
            <topic>Black Holes</topic>
            <topic>Quantum Mechanics</topic>
        </topics>
    </book>
</bookstore>
```
## Scala Example

```scala
// Scala example
import scala.collection.mutable

case class Product(id: Int, name: String, price: Double, category: String)

class ShoppingCart {
  private val items = mutable.Map[Int, (Product, Int)]()

  def addItem(product: Product, quantity: Int = 1): Unit = {
    items.get(product.id) match {
      case Some((existingProduct, existingQuantity)) =>
        items(product.id) = (existingProduct, existingQuantity + quantity)
      case None =>
        items(product.id) = (product, quantity)
    }
  }

  def removeItem(productId: Int): Unit = {
    items.remove(productId)
  }

  def getTotalPrice: Double = {
    items.values.map { case (product, quantity) =>
      product.price * quantity
    }.sum
  }

  def getItemCount: Int = {
    items.values.map(_._2).sum
  }

  def getItemsByCategory(category: String): List[(Product, Int)] = {
    items.values.filter(_._1.category == category).toList
  }
}

object ShoppingApp extends App {
  val cart = new ShoppingCart()

  val laptop = Product(1, "MacBook Pro", 1999.99, "Electronics")
  val book = Product(2, "Scala Programming", 45.99, "Books")

  cart.addItem(laptop)
  cart.addItem(book, 2)

  println(s"Total items: ${cart.getItemCount}")
  println(f"Total price: $$${cart.getTotalPrice}%.2f")
}
```
## Haskell Example

```haskell
-- Haskell example
module Main where

import Data.List (sort, nub)

-- Define a custom data type
data Person = Person
    { name :: String
    , age :: Int
    , email :: String
    } deriving (Show, Eq)

-- Function to check if a person is an adult
isAdult :: Person -> Bool
isAdult person = age person >= 18

-- Function to get unique ages from a list of people
getUniqueAges :: [Person] -> [Int]
getUniqueAges people = nub $ sort $ map age people

-- Function to filter adults and sort by age
getAdultsSortedByAge :: [Person] -> [Person]
getAdultsSortedByAge people =
    sortBy (\p1 p2 -> compare (age p1) (age p2)) $
    filter isAdult people
  where
    sortBy cmp = map snd . sort . map (\x -> (cmp x undefined, x))

-- Recursive function to calculate factorial
factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)

-- Function using list comprehension
generatePairs :: [Int] -> [(Int, Int)]
generatePairs xs = [(x, y) | x <- xs, y <- xs, x < y]

main :: IO ()
main = do
    let people = [ Person "Alice" 25 "alice@example.com"
                 , Person "Bob" 17 "bob@example.com"
                 , Person "Charlie" 30 "charlie@example.com"
                 ]

    putStrLn "All people:"
    mapM_ print people

    putStrLn "\nAdults only:"
    mapM_ print $ getAdultsSortedByAge people

    putStrLn $ "\nUnique ages: " ++ show (getUniqueAges people)
    putStrLn $ "Factorial of 5: " ++ show (factorial 5)
    putStrLn $ "Pairs from [1,2,3,4]: " ++ show (generatePairs [1,2,3,4])
```
## Lua Example

<!-- markdownlint-disable MD013 -->
```lua
-- Lua example
local json = require("json")

-- Define a class-like table
local Person = {}
Person.__index = Person

function Person:new(name, age, occupation)
    local instance = {
        name = name,
        age = age,
        occupation = occupation or "Unemployed"
    }
    setmetatable(instance, Person)
    return instance
end

function Person:introduce()
    return string.format("Hi, I'm %s, %d years old, working as %s",
                        self.name, self.age, self.occupation)
end

function Person:canVote()
    return self.age >= 18
end

function Person:toJSON()
    return json.encode({
        name = self.name,
        age = self.age,
        occupation = self.occupation
    })
end

-- Employee class inherits from Person
local Employee = {}
Employee.__index = Employee
setmetatable(Employee, {__index = Person})

function Employee:new(name, age, occupation, salary, department)
    local instance = Person:new(name, age, occupation)
    instance.salary = salary
    instance.department = department
    setmetatable(instance, Employee)
    return instance
end

function Employee:getAnnualSalary()
    return self.salary * 12
end

function Employee:promote(newSalary, newDepartment)
    self.salary = newSalary or self.salary
    self.department = newDepartment or self.department
    print(string.format("%s has been promoted!", self.name))
end

-- Usage example
local function main()
    local people = {}

    -- Create some people
    table.insert(people, Person:new("Alice", 25, "Designer"))
    table.insert(people, Employee:new("Bob", 30, "Developer", 5000, "Engineering"))
    table.insert(people, Person:new("Charlie", 16, "Student"))

    -- Process each person
    for i, person in ipairs(people) do
        print(string.format("%d. %s", i, person:introduce()))
        print(string.format("   Can vote: %s", person:canVote() and "Yes" or "No"))

        -- Check if it's an employee
        if person.salary then
            print(string.format("   Annual salary: $%d", person:getAnnualSalary()))
        end
        print()
    end

    -- Demonstrate promotion
    local bob = people[2]
    if bob.salary then
        bob:promote(6000, "Senior Engineering")
    end
end

main()
```
<!-- markdownlint-enable MD013 -->

## R Example

<!-- markdownlint-disable MD013 -->
```r
# R example
library(ggplot2)
library(dplyr)

# Create sample data
set.seed(123)
students <- data.frame(
  id = 1:100,
  name = paste("Student", 1:100),
  math_score = rnorm(100, mean = 75, sd = 15),
  science_score = rnorm(100, mean = 80, sd = 12),
  english_score = rnorm(100, mean = 78, sd = 10),
  grade_level = sample(c("Freshman", "Sophomore", "Junior", "Senior"), 100, replace = TRUE),
  stringsAsFactors = FALSE
)

# Data analysis functions
calculate_gpa <- function(math, science, english) {
  avg_score <- (math + science + english) / 3

  # Convert to GPA scale (4.0)
  gpa <- case_when(
    avg_score >= 97 ~ 4.0,
    avg_score >= 93 ~ 3.7,
    avg_score >= 90 ~ 3.3,
    avg_score >= 87 ~ 3.0,
    avg_score >= 83 ~ 2.7,
    avg_score >= 80 ~ 2.3,
    avg_score >= 77 ~ 2.0,
    avg_score >= 73 ~ 1.7,
    avg_score >= 70 ~ 1.3,
    avg_score >= 67 ~ 1.0,
    TRUE ~ 0.0
  )

  return(gpa)
}

# Add calculated columns
students <- students %>%
  mutate(
    gpa = calculate_gpa(math_score, science_score, english_score),
    total_score = math_score + science_score + english_score,
    honor_roll = gpa >= 3.5
  )

# Summary statistics by grade level
grade_summary <- students %>%
  group_by(grade_level) %>%
  summarise(
    count = n(),
    avg_gpa = round(mean(gpa), 2),
    avg_math = round(mean(math_score), 1),
    avg_science = round(mean(science_score), 1),
    avg_english = round(mean(english_score), 1),
    honor_roll_pct = round(mean(honor_roll) * 100, 1),
    .groups = 'drop'
  )

print("Grade Level Summary:")
print(grade_summary)

# Create visualization
gpa_plot <- ggplot(students, aes(x = grade_level, y = gpa)) +
  geom_boxplot(aes(fill = grade_level), alpha = 0.7) +
  geom_jitter(width = 0.2, alpha = 0.5) +
  scale_fill_brewer(type = "qual", palette = "Set2") +
  labs(
    title = "GPA Distribution by Grade Level",
    x = "Grade Level",
    y = "GPA (4.0 scale)",
    fill = "Grade Level"
  ) +
  theme_minimal() +
  theme(
    plot.title = element_text(hjust = 0.5, size = 14, face = "bold"),
    legend.position = "none"
  )

# Display the plot
print(gpa_plot)

# Find top performers
top_students <- students %>%
  arrange(desc(gpa)) %>%
  head(10) %>%
  select(name, grade_level, gpa, math_score, science_score, english_score)

print("Top 10 Students by GPA:")
print(top_students)
```
<!-- markdownlint-enable MD013 -->

## Long Line Examples

Test cases for horizontal scrolling when code lines are very long:

<!-- markdownlint-disable MD013 -->
```javascript
// Very long JavaScript line example
const veryLongVariableName =
  'This is an extremely long string that should definitely cause horizontal scrolling in the code block when displayed in a web browser because it contains way more text than can fit in a normal width container and should demonstrate the horizontal scrollbar functionality that we just implemented for code blocks'

// Another long line with method chaining
const result = someVeryLongObjectNameWithManyProperties
  .methodWithAVeryLongName()
  .anotherMethodWithAnEvenLongerName()
  .yetAnotherMethodThatHasAnExtremelyLongNameForDemonstrationPurposes()
  .finalMethod()
```
<!-- markdownlint-enable MD013 -->

<!-- markdownlint-disable MD013 -->
```bash
# Very long bash command example
curl -X POST "https://api.example.com/v1/very/long/endpoint/path/that/goes/on/forever/and/should/cause/horizontal/scrolling" -H "Authorization: Bearer <REDACTED_TOKEN>" -H "Content-Type: application/json" -d '{"key": "value", "anotherKey": "anotherValue", "yetAnotherKey": "yetAnotherValue"}'
```
<!-- markdownlint-enable MD013 -->

<!-- markdownlint-disable MD013 -->
```python
# Very long Python line with many parameters
def very_long_function_name_for_demonstration_purposes(parameter_one_with_long_name, parameter_two_with_even_longer_name, parameter_three_that_is_ridiculously_long, parameter_four_for_good_measure, parameter_five_just_because):
    return f"This function has a very long signature that should cause horizontal scrolling: {parameter_one_with_long_name}, {parameter_two_with_even_longer_name}, {parameter_three_that_is_ridiculously_long}"
```
<!-- markdownlint-enable MD013 -->

## Vertical Scrolling Test

This section contains a very long code block to test the vertical scrollbar
functionality:

<!-- markdownlint-disable MD013 -->
```python
# Very long Python code block for testing vertical scrollbar
import json
import datetime
from typing import List, Dict, Optional, Union, Tuple
from dataclasses import dataclass

@dataclass
class User:
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    is_active: bool
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[datetime.date] = None

    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def age(self) -> Optional[int]:
        if self.date_of_birth:
            today = datetime.date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None

    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_active': self.is_active,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
            'website': self.website,
            'location': self.location,
            'phone_number': self.phone_number,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'age': self.age()
        }

class UserRepository:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.users: Dict[int, User] = {}  # Primary storage keyed by user ID
        self.users_by_username: Dict[str, User] = {}  # Secondary index by username
        self.users_by_email: Dict[str, User] = {}  # Secondary index by email
        self.connection = None

    def connect(self):
        """Establish database connection"""
        try:
            # Simulated database connection
            print(f"Connecting to database: {self.database_url}")
            self.connection = True
            return True
        except Exception as e:
            print(f"Failed to connect to database: {e}")
            return False

    def disconnect(self):
        """Close database connection"""
        if self.connection:
            self.connection = None
            print("Database connection closed")

    def create_user(self, user_data: Dict) -> User:
        """Create a new user"""
        user_id = max(self.users.keys(), default=0) + 1  # Generate next ID
        user = User(
            id=user_id,
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now(),
            is_active=True,
            profile_picture=user_data.get('profile_picture'),
            bio=user_data.get('bio'),
            website=user_data.get('website'),
            location=user_data.get('location'),
            phone_number=user_data.get('phone_number'),
            date_of_birth=user_data.get('date_of_birth')
        )
        # Store in primary dictionary and secondary indexes
        self.users[user.id] = user
        self.users_by_username[user.username] = user
        self.users_by_email[user.email] = user
        return user

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Retrieve user by ID - O(1) lookup"""
        return self.users.get(user_id)

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Retrieve user by username - O(1) lookup"""
        return self.users_by_username.get(username)

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Retrieve user by email - O(1) lookup"""
        return self.users_by_email.get(email)

    def get_all_users(self) -> List[User]:
        """Retrieve all users"""
        return list(self.users.values())

    def get_active_users(self) -> List[User]:
        """Retrieve all active users"""
        return [user for user in self.users.values() if user.is_active]

    def get_users_by_location(self, location: str) -> List[User]:
        """Retrieve users by location"""
        return [user for user in self.users.values() if user.location and user.location.lower() == location.lower()]

    def update_user(self, user_id: int, update_data: Dict) -> Optional[User]:
        """Update user information"""
        user = self.get_user_by_id(user_id)
        if not user:
            return None

        # Handle username change - update secondary index
        if 'username' in update_data and update_data['username'] != user.username:
            # Remove old username from index
            del self.users_by_username[user.username]
            # Update username
            user.username = update_data['username']
            # Add new username to index
            self.users_by_username[user.username] = user

        # Handle email change - update secondary index
        if 'email' in update_data and update_data['email'] != user.email:
            # Remove old email from index
            del self.users_by_email[user.email]
            # Update email
            user.email = update_data['email']
            # Add new email to index
            self.users_by_email[user.email] = user

        # Define allowed fields that can be updated directly
        allowed_fields = [
            'first_name', 'last_name', 'profile_picture', 'bio',
            'website', 'location', 'phone_number', 'date_of_birth', 'is_active'
        ]

        # Update other fields if provided
        for field in allowed_fields:
            if field in update_data:
                setattr(user, field, update_data[field])

        user.updated_at = datetime.datetime.now()
        return user

    def delete_user(self, user_id: int) -> bool:
        """Delete user by ID"""
        user = self.get_user_by_id(user_id)
        if user:
            # Remove from all dictionaries
            del self.users[user.id]
            del self.users_by_username[user.username]
            del self.users_by_email[user.email]
            return True
        return False

    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate user instead of deleting"""
        user = self.get_user_by_id(user_id)
        if user:
            user.is_active = False
            user.updated_at = datetime.datetime.now()
            return True
        return False

    def search_users(self, query: str) -> List[User]:
        """Search users by name, username, or email"""
        query = query.lower()
        results = []
        for user in self.users.values():
            if (query in user.username.lower() or
                query in user.email.lower() or
                query in user.first_name.lower() or
                query in user.last_name.lower() or
                query in user.full_name().lower()):
                results.append(user)
        return results

    def get_user_statistics(self) -> Dict:
        """Get user statistics"""
        total_users = len(self.users)
        active_users = len(self.get_active_users())
        inactive_users = total_users - active_users

        locations = {}
        for user in self.users.values():
            if user.location:
                locations[user.location] = locations.get(user.location, 0) + 1

        ages = [a for a in (u.age() for u in self.users.values()) if a is not None]
        avg_age = sum(ages) / len(ages) if ages else 0

        return {
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'locations': locations,
            'average_age': round(avg_age, 2),
            'users_with_bio': len([user for user in self.users.values() if user.bio]),
            'users_with_website': len([user for user in self.users.values() if user.website]),
            'users_with_phone': len([user for user in self.users.values() if user.phone_number])
        }

    def export_users_to_json(self, filename: str) -> bool:
        """Export all users to JSON file"""
        try:
            users_data = [user.to_dict() for user in self.users.values()]
            with open(filename, 'w') as f:
                json.dump(users_data, f, indent=2, default=str)
            print(f"Users exported to {filename}")
            return True
        except Exception as e:
            print(f"Error exporting users: {e}")
            return False

    def import_users_from_json(self, filename: str) -> bool:
        """Import users from JSON file"""
        try:
            with open(filename, 'r') as f:
                users_data = json.load(f)

            for user_data in users_data:
                # Convert string dates back to datetime objects
                user_data['created_at'] = datetime.datetime.fromisoformat(user_data['created_at'])
                user_data['updated_at'] = datetime.datetime.fromisoformat(user_data['updated_at'])
                if user_data.get('date_of_birth'):
                    user_data['date_of_birth'] = datetime.date.fromisoformat(user_data['date_of_birth'])

                # Remove computed fields
                user_data.pop('full_name', None)
                user_data.pop('age', None)

                user = User(**user_data)
                # Store in primary dictionary and secondary indexes
                self.users[user.id] = user
                self.users_by_username[user.username] = user
                self.users_by_email[user.email] = user

            print(f"Users imported from {filename}")
            return True
        except Exception as e:
            print(f"Error importing users: {e}")
            return False

# Example usage and demonstration
def main():
    """Main function to demonstrate the UserRepository functionality"""

    # Initialize repository
    repo = UserRepository("postgresql://user:pass@localhost/users_db")

    # Connect to database
    if not repo.connect():
        print("Failed to connect to database")
        return

    try:
        # Create sample users
        sample_users = [
            {
                'username': 'johndoe',
                'email': 'john.doe@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'bio': 'Software developer with 5 years of experience',
                'location': 'New York',
                'website': 'https://johndoe.dev',
                'phone_number': '+1-555-0123',
                'date_of_birth': datetime.date(1990, 5, 15)
            },
            {
                'username': 'janesmith',
                'email': 'jane.smith@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'bio': 'UX Designer passionate about creating beautiful interfaces',
                'location': 'San Francisco',
                'website': 'https://janesmith.design',
                'phone_number': '+1-555-0456',
                'date_of_birth': datetime.date(1988, 12, 3)
            },
            {
                'username': 'bobwilson',
                'email': 'bob.wilson@example.com',
                'first_name': 'Bob',
                'last_name': 'Wilson',
                'bio': 'Data scientist and machine learning enthusiast',
                'location': 'New York',
                'date_of_birth': datetime.date(1992, 8, 20)
            },
            {
                'username': 'alicejohnson',
                'email': 'alice.johnson@example.com',
                'first_name': 'Alice',
                'last_name': 'Johnson',
                'bio': 'Product manager with a passion for innovation',
                'location': 'Seattle',
                'website': 'https://alicejohnson.com',
                'phone_number': '+1-555-0789',
                'date_of_birth': datetime.date(1985, 3, 10)
            }
        ]

        # Create users
        created_users = []
        for user_data in sample_users:
            user = repo.create_user(user_data)
            created_users.append(user)
            print(f"Created user: {user.full_name()} (@{user.username})")

        print(f"\nTotal users created: {len(created_users)}")

        # Demonstrate various queries
        print("\n=== User Queries ===")

        # Get user by ID
        user_1 = repo.get_user_by_id(1)
        if user_1:
            print(f"User with ID 1: {user_1.full_name()}")

        # Get user by username
        john = repo.get_user_by_username('johndoe')
        if john:
            print(f"Found user by username: {john.full_name()}")

        # Get users by location
        ny_users = repo.get_users_by_location('New York')
        print(f"Users in New York: {[user.full_name() for user in ny_users]}")

        # Search users
        search_results = repo.search_users('john')
        print(f"Search results for 'john': {[user.full_name() for user in search_results]}")

        # Update user
        update_data = {
            'bio': 'Senior Software Developer with expertise in Python and web development',
            'website': 'https://johndoe-dev.com'
        }
        updated_user = repo.update_user(1, update_data)
        if updated_user:
            print(f"Updated user: {updated_user.username} - {updated_user.bio}")

        # Get statistics
        stats = repo.get_user_statistics()
        print(f"\n=== User Statistics ===")
        print(f"Total users: {stats['total_users']}")
        print(f"Active users: {stats['active_users']}")
        print(f"Average age: {stats['average_age']}")
        print(f"Location distribution: {stats['locations']}")

        # Export users
        export_filename = "users_backup.json"
        if repo.export_users_to_json(export_filename):
            print(f"Users exported to {export_filename}")

        # Deactivate a user
        if repo.deactivate_user(2):
            print("User with ID 2 has been deactivated")

        # Show updated statistics
        updated_stats = repo.get_user_statistics()
        print(f"\nUpdated active users: {updated_stats['active_users']}")
        print(f"Updated inactive users: {updated_stats['inactive_users']}")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Always disconnect
        repo.disconnect()

if __name__ == "__main__":
    main()
```
<!-- markdownlint-enable MD013 -->
