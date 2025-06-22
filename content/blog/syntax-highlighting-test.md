---
title: 'Syntax Highlighting Test'
date: '2025-06-08'
author: 'Blog Author'
excerpt: 'Testing different code block language syntax highlighting, including PowerShell.'
tags: ['syntax', 'highlighting', 'test']
category: 'Testing'
readTime: '1 min read'
---

This article tests various code blocks with different languages and ensures syntax highlighting works as expected without altering the current design or background colors.

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

## C# Example

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

## Regex Example

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

## R Example

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

## Long Line Examples

Test cases for horizontal scrolling when code lines are very long:

```javascript
// Very long JavaScript line example
const veryLongVariableName = "This is an extremely long string that should definitely cause horizontal scrolling in the code block when displayed in a web browser because it contains way more text than can fit in a normal width container and should demonstrate the horizontal scrollbar functionality that we just implemented for code blocks";

// Another long line with method chaining
const result = someVeryLongObjectNameWithManyProperties.methodWithAVeryLongName().anotherMethodWithAnEvenLongerName().yetAnotherMethodThatHasAnExtremelyLongNameForDemonstrationPurposes().finalMethod();
```

```bash
# Very long bash command example
curl -X POST "https://api.example.com/v1/very/long/endpoint/path/that/goes/on/forever/and/should/cause/horizontal/scrolling" -H "Authorization: Bearer very_long_token_here_that_makes_the_line_extremely_wide_for_testing_purposes" -H "Content-Type: application/json" -d '{"key": "value", "anotherKey": "anotherValue", "yetAnotherKey": "yetAnotherValue"}'
```

```python
# Very long Python line with many parameters
def very_long_function_name_for_demonstration_purposes(parameter_one_with_long_name, parameter_two_with_even_longer_name, parameter_three_that_is_ridiculously_long, parameter_four_for_good_measure, parameter_five_just_because):
    return f"This function has a very long signature that should cause horizontal scrolling: {parameter_one_with_long_name}, {parameter_two_with_even_longer_name}, {parameter_three_that_is_ridiculously_long}"
```
