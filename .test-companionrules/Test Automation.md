# Test Companion Rules

## Rule 1: Gather Information Before Converting Test Cases to Scripts

**Condition/Trigger:**
When tasked with converting a test case into a test script

**Action:**
Do NOT write the script immediately. Instead, follow this sequence:
1. Explore and understand the current project structure
2. Open and examine the application being tested
3. Gather all necessary context and requirements
4. Then write the test script

**Context:**
Writing test scripts without proper understanding of the project and application can lead to:
- Incorrect assumptions about functionality
- Scripts that don't align with the actual application behavior
- Inefficient or incomplete test coverage
- Rework and corrections later in the process

**Example:**
Instead of directly writing a script for "User Login Test", first examine the project to understand:
- What testing framework is being used
- What the login UI actually looks like
- What validation rules apply
- What error messages appear in different scenarios