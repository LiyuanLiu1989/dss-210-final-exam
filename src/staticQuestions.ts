import { Question } from "./types";

export const STATIC_QUESTIONS: Question[] = [
  // 1-20: SAMPLING METHODS (FROM PDF)
  {
    topic: "Sampling Methods",
    content: "Employee Workplace Survey: The HR team randomly chooses 6 office buildings and collects responses from every employee working in those locations. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Cluster Sampling involves dividing the population into groups (clusters), randomly picking entire clusters, and surveying every individual within them. Here, office buildings are the clusters.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Employee Workplace Survey: An HR representative interviews employees who happen to be leaving the cafeteria during lunch. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 1,
    explanation: "Convenience Sampling is a non-probability method where researchers choose participants based on easy availability (e.g., people walking by) rather than random selection.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Employee Workplace Survey: The offices are arranged alphabetically, and every 4th office is selected for the survey. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 2,
    explanation: "Systematic Sampling involves selecting every 'kth' (in this case, 4th) item from an ordered list. The interval k is determined by the required sample size and population list.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Employee Workplace Survey: Each employee is assigned an ID number, and 100 IDs are selected using a random number generator. What type of sampling is this?",
    options: ["Simple Random Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Every individual in the population has an equal chance of being selected independently.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Employee Workplace Survey: Employees are first separated by job role (managers and staff), then 20% are randomly selected from each group. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 3,
    explanation: "Stratified Sampling involves dividing the population into sub-groups (strata) based on a specific characteristic (like job role) and then taking a random sample from each stratum to ensure representation.",
    difficulty: "medium"
  },
  {
    topic: "Sampling Methods",
    content: "Hospital Patient Experience: They randomly pick 5 hospitals and survey every patient discharged from those hospitals that day. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Entire clusters (hospitals) are selected, and all members within them are surveyed.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Hospital Patient Experience: Nurses ask patients sitting in the waiting room to complete a survey. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 1,
    explanation: "Participants are chosen based on easy availability.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Hospital Patient Experience: Every 3rd hospital on the regional hospital list is chosen. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 2,
    explanation: "A fixed interval pattern from a list is used.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Hospital Patient Experience: Patient record numbers are used to randomly choose 120 patients. What type of sampling is this?",
    options: ["Simple Random Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Every patient has an equal chance of selection via ID numbers.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Hospital Patient Experience: Patients are divided into age groups before randomly sampling from each age bracket. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 3,
    explanation: "Dividing by strata (age) and then sampling ensures representation from all groups.",
    difficulty: "medium"
  },
  {
    topic: "Sampling Methods",
    content: "University Course Evaluation: Several academic departments are randomly selected, and all students in those departments are surveyed. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Entire departments are selected as clusters.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "University Course Evaluation: Survey forms are handed to students walking out of the library. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 1,
    explanation: "Surveying students at a convenient walk-by location.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "University Course Evaluation: The registrar selects every 10th course section from the master list. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 2,
    explanation: "Selecting every kth item from a master list.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "University Course Evaluation: Student IDs are randomly drawn from the university database. What type of sampling is this?",
    options: ["Simple Random Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Direct random selection from the whole database.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "University Course Evaluation: Students are grouped by academic year (freshman, sophomore, etc.), and a sample is taken from each level. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 3,
    explanation: "Grouping by academic level ensures all levels are represented.",
    difficulty: "medium"
  },
  {
    topic: "Sampling Methods",
    content: "Retail Shopping Study: They randomly choose 8 stores and survey every shopper who checks out during the afternoon. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Each store is a cluster.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Airline Customer Feedback: Travelers are first grouped by cabin class and then sampled. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 3,
    explanation: "Checking proportional representation from each seating class.",
    difficulty: "medium"
  },
  {
    topic: "Sampling Methods",
    content: "Public Transit Survey: Surveyors approach riders waiting at a busy downtown stop. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 1,
    explanation: "Easiest people to reach at a specific stop.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Apartment Resident Survey: Every 3rd building on the list is selected. What type of sampling is this?",
    options: ["Cluster Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 2,
    explanation: "Follows a fixed interval on a list.",
    difficulty: "easy"
  },
  {
    topic: "Sampling Methods",
    content: "Fitness Center Study: Membership IDs are randomly chosen. What type of sampling is this?",
    options: ["Simple Random Sampling", "Convenience Sampling", "Systematic Sampling", "Stratified Sampling"],
    correctOptionIndex: 0,
    explanation: "Every ID has an equal chance.",
    difficulty: "easy"
  },
  // 21-40: BAYES' THEOREM / REVISED PROBABILITY (FROM PDF)
  {
    topic: "Bayes' Theorem",
    content: "Printer Quality: A printer is calibrated correctly 80% of the time. If calibrated, it prints a clear label 92% of the time. If not calibrated, it prints a clear label 35% of the time. If the first label is clear, what is the revised probability it was calibrated correctly?",
    options: ["0.8000", "0.9132", "0.7360", "0.0700"],
    correctOptionIndex: 1,
    explanation: "This is a Bayes' Theorem problem ($P(A|B)$). \n1. $P(\text{Calibrated}) = 0.80$ \n2. $P(\text{Clear}|\text{Calibrated}) = 0.92$ \n3. $P(\text{Clear}|\text{Not Calibrated}) = 0.35$ \nFormula: $\\frac{0.80 \\times 0.92}{(0.80 \\times 0.92) + (0.20 \\times 0.35)} = \\frac{0.736}{0.736 + 0.07} = 0.9132$.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Email Spam Filter: A spam filter updates itself 65% of the time. If updated, it detects spam 90% of the time. If not updated, it detects spam 50% of the time. If a spam email is successfully detected, what is the revised probability the filter updated correctly?",
    options: ["0.7697", "0.6500", "0.5850", "0.9000"],
    correctOptionIndex: 0,
    explanation: "P(U|D) = (0.90*0.65)/(0.585+0.175) = 0.585/0.76 ≈ 0.7697.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Medical Scanner: A scanner is properly configured 75% of the time. If configured, it gives a readable image 96% of the time. If not, it gives a readable image 45% of the time. If the first image is readable, what is the revised probability it was configured correctly?",
    options: ["0.7500", "0.8649", "0.7200", "0.9600"],
    correctOptionIndex: 1,
    explanation: "This is a Bayes' Theorem problem ($P(A|B)$). \n1. **Prior:** $P(\\text{Properly Configured}) = 0.75$ \n2. **Likelihood:** $P(\\text{Readable}|\\text{Proper}) = 0.96$. \n3. **Failure Likelihood:** $P(\\text{Readable}|\\text{Not Proper}) = 0.45$. \n**Calculation:** $\\frac{0.75 \\times 0.96}{(0.75 \\times 0.96) + (0.25 \\times 0.45)} = \\frac{0.72}{0.72 + 0.1125} = 0.8649$.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Bakery Oven: An oven is set to the right temperature 60% of the time. If correct, the first loaf bakes properly 94% of the time. If incorrect, it bakes properly 30% of the time. If the first loaf looks good, what is the probability the oven was set correctly?",
    options: ["0.6000", "0.8246", "0.5640", "0.9400"],
    correctOptionIndex: 1,
    explanation: "P(T|B) = (0.94*0.60)/(0.564+0.120) = 0.564/0.684 ≈ 0.8246.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Car Wash Equipment: The washer is adjusted properly 72% of the time. If adjusted, the car comes out clean 91% of the time. If not, it comes out clean 38% of the time. If the first car is clean, what is the probability it was adjusted properly?",
    options: ["0.8603", "0.7200", "0.6552", "0.9100"],
    correctOptionIndex:0,
    explanation: "P(A|C) = (0.91*0.72)/(0.6552+0.1064) = 0.6552/0.7616 ≈ 0.8603.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Coffee Machine Setup: An espresso machine is tuned properly 68% of the time. If tuned, the first cup tastes right 93% of the time. If not tuned, it tastes right 42% of the time. If the first cup tastes right, what is the revised probability it was tuned properly?",
    options: ["0.8247", "0.6800", "0.6324", "0.9300"],
    correctOptionIndex: 0,
    explanation: "P(T|R) = (0.93*0.68)/(0.6324+0.1344) = 0.6324/0.7668 ≈ 0.8247.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Packaging Machine: A machine is aligned correctly 78% of the time. If aligned, the first package is sealed properly 97% of the time. If not, it is sealed properly 48% of the time. If the first package is sealed properly, what is the revised probability of correct alignment?",
    options: ["0.8775", "0.7800", "0.7566", "0.9700"],
    correctOptionIndex: 0,
    explanation: "P(A|S) = (0.97*0.78)/(0.7566+0.1056) = 0.7566/0.8622 ≈ 0.8775.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Mobile App Deployment: An app is deployed correctly 70% of the time. If deployed correctly, the first user login succeeds 98% of the time. If incorrectly, it still succeeds 55% of the time. If the first login succeeds, what is the revised probability of correct deployment?",
    options: ["0.8061", "0.7000", "0.6860", "0.9800"],
    correctOptionIndex: 0,
    explanation: "P(D|L) = (0.98*0.70)/(0.686+0.165) = 0.686/0.851 ≈ 0.8061.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Vending Machine Calibration: A machine is stocked correctly 62% of the time. If stocked, the first customer gets the correct item 95% of the time. If incorrectly, they still get it 36% of the time. If the first customer receives the correct item, what is the revised probability of correct stocking?",
    options: ["0.8115", "0.6200", "0.5890", "0.9500"],
    correctOptionIndex: 0,
    explanation: "P(S|C) = (0.95*0.62)/(0.589+0.1368) = 0.589/0.7258 ≈ 0.8115.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Security System Test: The alarm is armed properly 74% of the time. If armed, it detects an intrusion 94% of the time. If not, it still detects it 41% of the time. If an intrusion is detected during a test, what is the revised probability of proper arming?",
    options: ["0.8671", "0.7400", "0.6956", "0.9400"],
    correctOptionIndex: 0,
    explanation: "P(A|D) = (0.94*0.74)/(0.6956+0.1066) = 0.6956/0.8022 ≈ 0.8671.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Greenhouse Watering System: The timer is programmed correctly 66% of the time. If correct, the first plant receives enough water 89% of the time. If not, it still receives enough water 33% of the time. If the first plant receives enough water, what is the probability the timer was programmed correctly?",
    options: ["0.8396", "0.6600", "0.5874", "0.8900"],
    correctOptionIndex: 0,
    explanation: "P(P|W) = (0.89*0.66)/(0.5874+0.1122) = 0.5874/0.6996 ≈ 0.8396.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Robotics Line: A robot arm is positioned correctly 82% of the time. If positioned correctly, it places the first component accurately 93% of the time. If incorrectly, it still places it accurately 47% of the time. If the first component is placed accurately, what is the updated probability of correct positioning?",
    options: ["0.9001", "0.8200", "0.7626", "0.9300"],
    correctOptionIndex: 0,
    explanation: "P(R|A) = (0.93*0.82)/(0.7626+0.0846) = 0.7626/0.8472 ≈ 0.9001.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Farm Irrigation System: The irrigation line is installed correctly 58% of the time. If correct, the first field gets enough water 90% of the time. If not, it still gets enough water 28% of the time. If the first field receives enough water, what is the revised probability of correct installation?",
    options: ["0.8161", "0.5800", "0.5220", "0.9000"],
    correctOptionIndex: 0,
    explanation: "P(I|W) = (0.90*0.58)/(0.522+0.1176) = 0.522/0.6396 ≈ 0.8161.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Website Payment Gateway: A developer knows the payment gateway is configured correctly 77% of the time. If correct, the first transaction goes through 96% of the time. If incorrect, it still goes through 44% of the time. If the first transaction succeeds, what is the revised probability produced?",
    options: ["0.8796", "0.7700", "0.7392", "0.9600"],
    correctOptionIndex: 0,
    explanation: "P(C|T) = (0.96*0.77)/(0.7392+0.1012) = 0.7392/0.8404 ≈ 0.8796.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Laundry Machine Check: An industrial washer is loaded properly 69% of the time. If loaded properly, the first batch is fully cleaned 94% of the time. If incorrectly, it is still cleaned 39% of the time. If the first batch is fully cleaned, what is the revised probability the machine was loaded properly?",
    options: ["0.8429", "0.6900", "0.6486", "0.9400"],
    correctOptionIndex: 0,
    explanation: "P(L|C) = (0.94*0.69)/(0.6486+0.1209) = 0.6486/0.7695 ≈ 0.8429.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Solar Panel Installation: A solar panel system is wired correctly 73% of the time. If correctly wired, the first energy test passes 97% of the time. If incorrectly, it still passes 34% of the time. If the first test passes, what is the revised probability of correct wiring?",
    options: ["0.8852", "0.7300", "0.7081", "0.9700"],
    correctOptionIndex: 0,
    explanation: "P(W|P) = (0.97*0.73)/(0.7081+0.0918) = 0.7081/0.7999 ≈ 0.8852.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Call Center System Setup: A phone routing system is programmed correctly 64% of the time. If correct, the first call reaches the right department 91% of the time. If incorrectly, it still reaches the right department 37% of the time. If the first call reaches the right department, what is the updated probability of correct programming?",
    options: ["0.8139", "0.6400", "0.5824", "0.9100"],
    correctOptionIndex: 0,
    explanation: "P(P|R) = (0.91*0.64)/(0.5824+0.1332) = 0.5824/0.7156 ≈ 0.8139.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "3D Printer Alignment: A lab manager knows a 3D printer is aligned properly 71% of the time. If aligned, the first model prints successfully 95% of the time. If not, it prints successfully 43% of the time. If the first model prints successfully, what is the revised probability of alignment?",
    options: ["0.8440", "0.7100", "0.6745", "0.9500"],
    correctOptionIndex: 0,
    explanation: "P(A|S) = (0.95*0.71)/(0.6745+0.1247) = 0.6745/0.7992 ≈ 0.8440.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Food Processing Line: A slicer is adjusted correctly 76% of the time. If adjusted, the first package meets quality standards 93% of the time. If not, it still meets standards 46% of the time. If the first package meets quality standards, what is the revised probability the slicer was adjusted correctly?",
    options: ["0.8649", "0.7600", "0.7068", "0.9300"],
    correctOptionIndex: 0,
    explanation: "P(A|Q) = (0.93*0.76)/(0.7068+0.1104) = 0.7068/0.8172 ≈ 0.8649.",
    difficulty: "hard"
  },
  {
    topic: "Bayes' Theorem",
    content: "Drone Delivery System: A logistics manager knows a drone is programmed correctly 67% of the time. If correct, the first package is delivered to the right address 98% of the time. If not, it still delivers correctly 52% of the time. If the first package arrives at the correct address, what is the probability of correct programming?",
    options: ["0.7928", "0.6700", "0.6566", "0.9800"],
    correctOptionIndex: 0,
    explanation: "P(P|D) = (0.98*0.67)/(0.6566+0.1716) = 0.6566/0.8282 ≈ 0.7928.",
    difficulty: "hard"
  },
  // 41-60: PROBABILITY & NORMAL DISTRIBUTION (FROM PDF)
  {
    topic: "Probability",
    content: "IT System Backup: Server A fails 18% of the time, and Server B fails 25% of the time. What is the probability that BOTH servers activate successfully?",
    options: ["0.6150", "0.6200", "0.0450", "0.9500"],
    correctOptionIndex: 1,
    explanation: "P(A) = 0.82, P(B) = 0.75. P(Both) = 0.82 * 0.75 = 0.615. (Rounding to 0.62 per doc).",
    difficulty: "medium"
  },
  {
    topic: "Probability",
    content: "IT System Backup: Server A fails 18%, and Server B fails 25%. What is the probability that AT LEAST ONE server activates?",
    options: ["0.95", "0.62", "0.05", "0.43"],
    correctOptionIndex: 0,
    explanation: "P(At least one) = 1 - P(Neither). P(Neither) = 0.18 * 0.25 = 0.045. 1 - 0.045 = 0.955.",
    difficulty: "medium"
  },
  {
    topic: "Probability",
    content: "Food Delivery System: Driver 1 fails 22% of the time, and Driver 2 fails 35%. What is the probability that NEITHER driver delivers the package?",
    options: ["0.077", "0.920", "0.510", "0.010"],
    correctOptionIndex: 0,
    explanation: "P(Neither) = 0.22 * 0.35 = 0.077.",
    difficulty: "medium"
  },
  {
    topic: "Probability",
    content: "Fire Alarm Sensors: Sensor A fails 10% of the time, and Sensor B fails 30%. What is the probability that BOTH sensors work correctly?",
    options: ["0.63", "0.97", "0.03", "0.40"],
    correctOptionIndex: 0,
    explanation: "P(Both) = 0.90 * 0.70 = 0.63.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Labrador Retriever Weights: Mean weight is 72 lbs, std deviation is 8 lbs. What is the probability that a randomly selected Labrador weighs MORE than 70 pounds?",
    options: ["=1-NORM.DIST(70,72,8,TRUE)", "=NORM.DIST(70,72,8,TRUE)", "=1-NORM.DIST(72,70,8,TRUE)", "=NORM.S.DIST(70,TRUE)"],
    correctOptionIndex: 0,
    explanation: "To find the probability of 'MORE than', we calculate the area to the right. \nIn Excel: \n1. `=NORM.DIST(x, mean, sd, TRUE)` calculates the area to the LEFT (cumulative). \n2. To get the area to the RIGHT, we use `1 - NORM.DIST(...)`.",
    difficulty: "medium"
  },
  {
    topic: "Central Limit Theorem",
    content: "Labrador Weights (Mean 72, SD 8): What is the probability that the mean weight of 36 Labradors is MORE than 75 pounds?",
    options: ["=1-NORM.DIST(75,72,8/SQRT(36),TRUE)", "=NORM.DIST(75,72,8/6,TRUE)", "=1-NORM.DIST(75,72,8,TRUE)", "=1-NORM.S.DIST(75,TRUE)"],
    correctOptionIndex: 0,
    explanation: "For the sample mean, we must use the Central Limit Theorem. \n1. **Standard Error ($SE$):** $\\sigma / \\sqrt{n} = 8 / \\sqrt{36} = 1.333$. \n2. **Excel:** Always use the $SE$ in the third argument instead of the standard deviation.",
    difficulty: "hard"
  },
  {
    topic: "Normal Distribution",
    content: "Commute Times: Mean morning commute is 42 mins, SD is 6 mins. What is the probability that ONE commuter takes more than 45 minutes?",
    options: ["=1-NORM.DIST(45,42,6,TRUE)", "=NORM.DIST(45,42,6,TRUE)", "=1-NORM.DIST(42,45,6,TRUE)", "=NORM.DIST(45,42,6,FALSE)"],
    correctOptionIndex: 0,
    explanation: "This problem asks for an 'Upper Tail' probability (More Than). \n1. In Excel, `NORM.DIST(x, mean, sd, TRUE)` always gives the area to the LEFT (cumulative). \n2. To find the area to the RIGHT (more than), you must subtract the left area from the total area (1). \n**Formula:** `=1-NORM.DIST(45,42,6,TRUE)`.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Battery Life: Mean life is 18 hours, SD is 2.5 hours. What is the probability that one phone lasts MORE than 20 hours?",
    options: ["=1-NORM.DIST(20,18,2.5,TRUE)", "=NORM.DIST(20,18,2.5,TRUE)", "=1-NORM.DIST(18,20,2.5,TRUE)", "=NORM.DIST(20,18,2.5,FALSE)"],
    correctOptionIndex: 0,
    explanation: "1. For a single observation ($n=1$), we use the population standard deviation directly.\n2. Since we want the probability of lasting 'MORE than' 20 hours, we calculate 1 minus the cumulative probability up to 20.\n**Excel Syntax:** `=1-NORM.DIST(20, 18, 2.5, TRUE)`.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Package Delivery: Average delivery time is 52 mins, SD is 9 mins. What is the probability that one package takes MORE than 55 minutes?",
    options: ["=1-NORM.DIST(55,52,9,TRUE)", "=NORM.DIST(55,52,9,TRUE)", "=1-NORM.DIST(52,55,9,TRUE)", "0.55"],
    correctOptionIndex: 0,
    explanation: "1. Identify the 'More Than' requirement which signals an Upper Tail calculation.\n2. In Excel, take 1 minus the probability for a delivery time of 55 minutes, with a mean of 52 and SD of 9.\n**Formula:** `=1 - NORM.DIST(55, 52, 9, TRUE)`.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Exam Scores: Mean score is 78, SD is 11. What is the probability that one student scores more than 80 points?",
    options: ["=1-NORM.DIST(80,78,11,TRUE)", "=NORM.DIST(80,78,11,TRUE)", "=1-NORM.DIST(78,80,11,TRUE)", "0.80"],
    correctOptionIndex: 0,
    explanation: "Upper tail area calculation for normal distribution in Excel.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Light Bulb Lifetimes: Mean lifetime is 1200 hours, SD is 150 hours. What is the probability that one bulb lasts more than 1250 hours?",
    options: ["=1-NORM.DIST(1250,1200,150,TRUE)", "=NORM.DIST(1250,1200,150,TRUE)", "=1-NORM.DIST(1200,1250,150,TRUE)", "0.25"],
    correctOptionIndex: 0,
    explanation: "standard normal tail area mapping to Excel formula.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Newborn Baby Weights: Mean weight is 7.4 lbs, SD is 1.1 lbs. What is the probability that one baby weighs more than 8 pounds?",
    options: ["=1-NORM.DIST(8,7.4,1.1,TRUE)", "=NORM.DIST(8,7.4,1.1,TRUE)", "=1-NORM.DIST(7.4,8,1.1,TRUE)", "0.50"],
    correctOptionIndex: 0,
    explanation: "tail area for newborn weights.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Coffee Shop Waiting Times: Average wait time is 6.5 mins, SD is 1.8 mins. What is the probability that one customer waits more than 7 minutes?",
    options: ["=1-NORM.DIST(7,6.5,1.8,TRUE)", "=NORM.DIST(7,6.5,1.8,TRUE)", "=1-NORM.DIST(6.5,7,1.8,TRUE)", "0.65"],
    correctOptionIndex: 0,
    explanation: "Calculating probabilities for average wait times.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Tomato Weights: Mean weight is 10.5 oz, SD is 1.4 oz. What is the probability that one tomato weighs more than 11 ounces?",
    options: ["=1-NORM.DIST(11,10.5,1.4,TRUE)", "=NORM.DIST(11,10.5,1.4,TRUE)", "=1-NORM.DIST(10.5,11,1.4,TRUE)", "0.11"],
    correctOptionIndex: 0,
    explanation: "Upper tail area calculation for tomato weight data.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Restaurant Meal Prep Time: Average preparation time is 24 mins, SD is 4 mins. What is the probability that one meal takes more than 26 minutes?",
    options: ["=1-NORM.DIST(26,24,4,TRUE)", "=NORM.DIST(26,24,4,TRUE)", "=1-NORM.DIST(24,26,4,TRUE)", "0.24"],
    correctOptionIndex: 0,
    explanation: "Calculating standard one-unit normal probability.",
    difficulty: "medium"
  },
  {
    topic: "Central Limit Theorem",
    content: "Student Heights (Mean 67, SD 3.5): What is the probability that the mean height of 100 students is MORE than 67.5 inches?",
    options: ["=1-NORM.DIST(67.5,67,3.5/SQRT(100),TRUE)", "=1-NORM.DIST(67.5,67,3.5,TRUE)", "=NORM.DIST(67.5,67,3.5/10,TRUE)", "=1-NORM.DIST(67,67.5,0.35,TRUE)"],
    correctOptionIndex: 0,
    explanation: "When sample n=100, we use the standard error SE = 3.5 / 10 = 0.35.",
    difficulty: "hard"
  },
  {
    topic: "Normal Distribution",
    content: "Airport Security Times: Mean time is 14 mins, SD is 3 mins. What is the probability that one traveler takes more than 15 minutes?",
    options: ["=1-NORM.DIST(15,14,3,TRUE)", "=NORM.DIST(15,14,3,TRUE)", "=1-NORM.DIST(14,15,3,TRUE)", "0.15"],
    correctOptionIndex: 0,
    explanation: "Standard excel formula for tail area.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Orange Juice Fill: Average fill is 64 oz, SD is 1.6 oz. What is the probability that one bottle contains more than 65 ounces?",
    options: ["=1-NORM.DIST(65,64,1.6,TRUE)", "=NORM.DIST(65,64,1.6,TRUE)", "=1-NORM.DIST(64,65,1.6,TRUE)", "0.64"],
    correctOptionIndex: 0,
    explanation: "Fill probability using normal curve.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Electricity Usage: Average use is 32 kWh, SD is 5 kWh. What is the probability that one household uses more than 35 kWh?",
    options: ["=1-NORM.DIST(35,32,5,TRUE)", "=NORM.DIST(35,32,5,TRUE)", "=1-NORM.DIST(32,35,5,TRUE)", "0.32"],
    correctOptionIndex: 0,
    explanation: "Excel mapping for household usage tails.",
    difficulty: "medium"
  },
  {
    topic: "Normal Distribution",
    content: "Running Shoe Prices: Mean price is $84, SD is $12. What is the probability that one pair costs more than $90?",
    options: ["=1-NORM.DIST(90,84,12,TRUE)", "=NORM.DIST(90,84,12,TRUE)", "=1-NORM.DIST(84,90,12,TRUE)", "0.84"],
    correctOptionIndex: 0,
    explanation: "Price probability calculation.",
    difficulty: "medium"
  },
  // 61-70: HYPOTHESIS TESTING & CONFIDENCE INTERVALS (NEW)
  {
    topic: "Hypothesis Testing",
    content: "A factory claims their lightbulbs last 1000 hours. A researcher suspects the bulbs last LESS than 1000 hours. They find a Z-score of -1.82. Which Excel formula finds the p-value for this LOWER-TAIL test?",
    options: ["=NORM.DIST(-1.82,0,1,TRUE)", "=1-NORM.DIST(-1.82,0,1,TRUE)", "=2*NORM.DIST(-1.82,0,1,TRUE)", "=NORM.S.INV(0.05)"],
    correctOptionIndex: 0,
    explanation: "For a Lower-Tail test ($H_A: \\mu < \\mu_0$), the p-value is simply the area to the left of the Z-score. In Excel, `=NORM.DIST(z, 0, 1, TRUE)` provides this direct cumulative probability.",
    difficulty: "hard"
  },
  {
    topic: "Hypothesis Testing",
    content: "A researcher is conducting a TWO-TAILED Z-test and calculates a Z-score of 2.15. What is the correct Excel syntax to find the p-value?",
    options: ["=2*(1-NORM.DIST(2.15,0,1,TRUE))", "=1-NORM.DIST(2.15,0,1,TRUE)", "=2*NORM.DIST(2.15,0,1,TRUE)", "=NORM.DIST(2.15,0,1,TRUE)"],
    correctOptionIndex: 0,
    explanation: "Since the test is two-tailed and $z > 0$, we find the area in the upper tail $(1 - \\text{NORM.DIST})$ and multiply by 2 to account for both tails. Formula: `=2*(1-NORM.DIST(z, 0, 1, TRUE))`.",
    difficulty: "hard"
  },
  {
    topic: "Hypothesis Testing",
    content: "If a statistical test results in a p-value of 0.034 and the significance level (α) is 0.05, what is the correct technical conclusion?",
    options: ["Reject H0, can support conclusion", "Fail to reject H0, cannot support conclusion", "Reject HA, can support conclusion", "Accept H0, reject HA"],
    correctOptionIndex: 0,
    explanation: "Since $p (0.034) \\le \\alpha (0.05)$, we **Reject $H_0$** and **Fail to Reject $H_A$**. This means we have enough evidence to **can support** the research conclusion.",
    difficulty: "medium"
  },
  {
    topic: "Confidence Intervals",
    content: "Which of the following $Z^*$ critical values should be used for a 95% Confidence Interval?",
    options: ["1.960", "1.645", "2.576", "1.751"],
    correctOptionIndex: 0,
    explanation: "For a 95% Confidence Interval, the standard $Z^*$ critical value is 1.960. This leaves 2.5% in each tail.",
    difficulty: "easy"
  },
  {
    topic: "Confidence Intervals",
    content: "A researcher wants to be MORE certain about their estimate. What happens to the Confidence Interval if they change from 95% confidence to 99% confidence (assuming same data)?",
    options: ["The interval gets wider", "The interval gets narrower", "The interval stays the same", "The mean increases"],
    correctOptionIndex: 0,
    explanation: "Increasing the confidence level increases the $Z^*$ critical value (e.g., from 1.96 to 2.576). A larger $Z^*$ results in a larger Margin of Error, making the interval **wider**.",
    difficulty: "medium"
  },
  {
    topic: "Hypothesis Testing",
    content: "An HR manager wants to test if the average employee works MORE than 40 hours. $H_0: \\mu = 40, H_A: \\mu > 40$. She finds $z = 2.45$. What is the p-value formula?",
    options: ["=1-NORM.DIST(2.45,0,1,TRUE)", "=NORM.DIST(2.45,0,1,TRUE)", "=2*(1-NORM.DIST(2.45,0,1,TRUE))", "=NORM.S.INV(0.975)"],
    correctOptionIndex: 0,
    explanation: "This is an Upper-Tail test ($H_A: \\mu > \\mu_0$). We need the area to the right of $z=2.45$. Syntax: `=1-NORM.DIST(z, 0, 1, TRUE)`.",
    difficulty: "hard"
  },
  {
    topic: "Hypothesis Testing",
    content: "In a Two-Tailed Z-test, the Z-score is -1.96. What is the correct p-value formula?",
    options: ["=2*NORM.DIST(-1.96,0,1,TRUE)", "=NORM.DIST(-1.96,0,1,TRUE)", "=2*(1-NORM.DIST(-1.96,0,1,TRUE))", "=1-NORM.DIST(-1.96,0,1,TRUE)"],
    correctOptionIndex: 0,
    explanation: "Since $z < 0$, we find the left tail and multiply by 2. Formula: `=2*NORM.DIST(z, 0, 1, TRUE)`.",
    difficulty: "hard"
  },
  {
    topic: "Hypothesis Testing",
    content: "If $p = 0.08$ and $\\alpha = 0.05$, what is the conclusion?",
    options: ["Fail to reject H0, reject HA", "Reject H0, can support HA", "Accept H0, accept HA", "Insufficient data"],
    correctOptionIndex: 0,
    explanation: "Since $p (0.08) > \\alpha (0.05)$, we **Fail to Reject $H_0$** and **Reject $H_A$**. We cannot support the research conclusion.",
    difficulty: "medium"
  },
  {
    topic: "Confidence Intervals",
    content: "If $n=64, \\sigma=10, \\bar{x}=50$, what is the Margin of Error for a 95% Confidence Interval ($Z^* = 1.96$)?",
    options: ["2.45", "1.96", "1.25", "5.00"],
    correctOptionIndex: 0,
    explanation: "$ME = Z^* \\times (\\sigma/\\sqrt{n}) = 1.96 \\times (10/8) = 1.96 \\times 1.25 = 2.45$.",
    difficulty: "hard"
  },
  {
    topic: "Confidence Intervals",
    content: "Which distribution is used for a Confidence Interval when the population standard deviation (σ) is NOT known?",
    options: ["T-distribution", "Z-distribution", "Binomial", "F-distribution"],
    correctOptionIndex: 0,
    explanation: "If σ is unknown, we must estimate it using the sample standard deviation $s$ and use the T-distribution.",
    difficulty: "easy"
  },
  {
    topic: "Excel",
    content: "In Excel, which formula finds the Z-score such that 95% of the area is to its LEFT in a standard normal distribution?",
    options: ["=NORM.S.INV(0.95)", "=NORM.S.DIST(0.95, TRUE)", "=NORM.INV(0.95, 0, 1)", "=NORM.S.INV(0.05)"],
    correctOptionIndex: 0,
    explanation: "`NORM.S.INV` takes the probability and returns the corresponding Z-score.",
    difficulty: "medium"
  },
  {
    topic: "Excel",
    content: "Which formula calculates the probability that a sample mean of 25 items is less than 10, given $\\mu=12$ and $\\sigma=5$?",
    options: ["=NORM.DIST(10, 12, 5/SQRT(25), TRUE)", "=NORM.DIST(10, 12, 5, TRUE)", "=NORM.S.DIST(10, TRUE)", "=1-NORM.DIST(10, 12, 5/5, TRUE)"],
    correctOptionIndex: 0,
    explanation: "For sample means, use the Standard Error ($5/\\sqrt{25}$) as the third argument.",
    difficulty: "hard"
  },
  {
    topic: "Hypothesis Testing",
    content: "A researcher conducts a Z-test for a population mean. The null hypothesis is $H_0: \\mu = 100$ and the alternative is $H_A: \\mu \\neq 100$. The computed Z-score is 2.00. Using the 2-rule for two-tails, what is the p-value calculation if the Z-table probability for 2.00 is 0.9772?",
    options: ["2 * (1 - 0.9772)", "1 - 0.9772", "2 * 0.9772", "0.9772 / 2"],
    correctOptionIndex: 0,
    explanation: "For a two-tailed test with $z > 0$, the p-value is 2 times the area in the upper tail. Area in upper tail = $1 - 0.9772 = 0.0228$. Total p-value = $2 \\times 0.0228 = 0.0456$.",
    difficulty: "hard"
  },
  {
    topic: "Confidence Intervals",
    content: "What is the correct $Z^*$ value for a 90% Confidence Interval?",
    options: ["1.645", "1.960", "2.326", "2.576"],
    correctOptionIndex: 0,
    explanation: "A 90% Confidence Interval leaves 5% in each tail. The Z-score for a cumulative area of 0.95 is 1.645.",
    difficulty: "easy"
  },
  {
    topic: "Hypothesis Testing",
    content: "When testing $H_A: \\mu < 50$, a researcher finds a Z-score of -2.10. If the Z-table gives 0.0179 for -2.10, what is the p-value?",
    options: ["0.0179", "0.9821", "0.0358", "0.0500"],
    correctOptionIndex: 0,
    explanation: "For a lower-tail test, the p-value is the area to the left of the Z-score, which is exactly what the Z-table (cumulative) provides.",
    difficulty: "medium"
  },
  {
    topic: "Excel",
    content: "Which Excel formula should be used to find the cumulative probability to the left of $x=85$ in a normal distribution with $\\mu=75$ and $\\sigma=10$?",
    options: ["=NORM.DIST(85, 75, 10, TRUE)", "=NORM.DIST(85, 75, 10, FALSE)", "=NORM.S.DIST(1, TRUE)", "=NORM.INV(0.85, 75, 10)"],
    correctOptionIndex: 0,
    explanation: "The `NORM.DIST` function calculates the probability for a specific value in a normal distribution. \n- **Arguments**: `(x, mean, standard_dev, cumulative)`.\n- **Cumulative**: Set to `TRUE` for the area to the left (cumulative probability), or `FALSE` for the probability density function (height).",
    difficulty: "medium"
  },
  {
    topic: "Excel",
    content: "You are performing a two-tailed hypothesis test with a calculated Z-score of 2.15. Which Excel formula correctly calculates the p-value?",
    options: ["=2*(1-NORM.S.DIST(2.15, TRUE))", "=1-NORM.S.DIST(2.15, TRUE)", "=NORM.S.DIST(2.15, TRUE)", "=2*NORM.S.DIST(-2.15, TRUE)"],
    correctOptionIndex: 0,
    explanation: "For a two-tailed test using a Z-score:\n1. Find the area of the upper tail: `1 - NORM.S.DIST(z, TRUE)`.\n2. Multiply by 2: `2 * (area)`. \nAlternatively, `=2*NORM.S.DIST(-ABS(z), TRUE)` also works as it finds the lower tail and doubles it.",
    difficulty: "hard"
  },
  {
    topic: "Excel",
    content: "To find the $t^*$ critical value for a 95% Confidence Interval with $n=20$ (degrees of freedom = 19), which Excel formula is appropriate?",
    options: ["=T.INV.2T(0.05, 19)", "=T.INV(0.95, 19)", "=T.DIST.2T(0.05, 19)", "=T.INV.2T(0.95, 19)"],
    correctOptionIndex: 0,
    explanation: "The `T.INV.2T` function is designed for two-tailed inverse calculations, perfect for Confidence Intervals.\n- **Probability**: Enter the 'alpha' (total area in both tails). For 95% confidence, alpha = 0.05.\n- **Deg_freedom**: $n - 1 = 19$.",
    difficulty: "hard"
  },
  {
    topic: "Excel",
    content: "Which formula calculates the Margin of Error for a Z-distribution confidence interval given $\\alpha=0.05, \\sigma=12,$ and $n=36$?",
    options: ["=CONFIDENCE.NORM(0.05, 12, 36)", "=CONFIDENCE.T(0.05, 12, 36)", "=NORM.S.INV(0.95)*12/SQRT(36)", "=1.96*12/36"],
    correctOptionIndex: 0,
    explanation: "The `CONFIDENCE.NORM(alpha, standard_dev, size)` function in Excel directly calculates the Margin of Error ($Z^* \\times \\sigma/\\sqrt{n}$) for a normal distribution.",
    difficulty: "medium"
  },
  {
    topic: "Excel",
    content: "In Excel, what does the formula `=NORM.S.DIST(1.5, TRUE)` represent?",
    options: ["The area to the left of Z=1.5", "The area to the right of Z=1.5", "The Z-score for a 1.5% probability", "The mean of the distribution"],
    correctOptionIndex: 0,
    explanation: "`NORM.S.DIST` (Standard Normal Distribution) calculates the cumulative probability (area to the left) for a given Z-score. Setting the second argument to `TRUE` ensures it is cumulative.",
    difficulty: "easy"
  },
  {
    topic: "Excel",
    content: "If you need to find the probability that a value falls BETWEEN 10 and 20 in a normal distribution (mean=15, sd=5), which Excel approach is correct?",
    options: ["=NORM.DIST(20,15,5,TRUE) - NORM.DIST(10,15,5,TRUE)", "=NORM.DIST(20,15,5,TRUE)", "=NORM.DIST(10,20,5,TRUE)", "=NORM.S.DIST(20,TRUE) - NORM.S.DIST(10,TRUE)"],
    correctOptionIndex: 0,
    explanation: "To find the area between two points ($a$ and $b$), subtract the cumulative area of the smaller value from the cumulative area of the larger value: $P(a < X < b) = P(X < b) - P(X < a)$.",
    difficulty: "medium"
  },
  {
    topic: "Excel",
    content: "Which function would you use to find the probability to the RIGHT of $t=2.093$ with $df=19$?",
    options: ["=T.DIST.RT(2.093, 19)", "=T.DIST(2.093, 19, TRUE)", "=1-T.INV(0.95, 19)", "=T.DIST.2T(2.093, 19)"],
    correctOptionIndex: 0,
    explanation: "`T.DIST.RT` (Right Tail) returns the area to the right of the given t-value. It is equivalent to `1 - T.DIST(x, df, TRUE)`.",
    difficulty: "medium"
  },
  {
    topic: "Confidence Intervals",
    content: "A researcher takes a small sample of $n=16$ items. The sample mean is 50, and the sample standard deviation ($s$) is 8. Using a $t^*$ value of 2.131 (for $df=15$), what is the 95% Confidence Interval?",
    options: ["(45.738, 54.262)", "(46.000, 54.000)", "(48.935, 51.065)", "(44.524, 55.476)"],
    correctOptionIndex: 0,
    explanation: "Since the population standard deviation ($\\sigma$) is unknown and the sample size is small, we use the T-distribution method:\n1. **Standard Error ($SE$)**: $s / \\sqrt{n} = 8 / \\sqrt{16} = 8/4 = 2.0$.\n2. **Margin of Error ($ME$)**: $t^* \\times SE = 2.131 \\times 2.0 = 4.262$.\n3. **Interval**: $\\bar{x} \\pm ME = 50 \\pm 4.262 = (45.738, 54.262)$.",
    difficulty: "hard"
  },
];
