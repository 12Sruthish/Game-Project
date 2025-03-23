const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;

const quizData = [
    { 
        question: "Which sorting algorithm has an average-case time complexity of O(n log n) and is not in-place?", 
        options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Selection Sort"], 
        answer: "Merge Sort" 
    },
    { 
        question: "In object-oriented programming, which principle is achieved by restricting access to certain details of an object?", 
        options: ["Encapsulation", "Abstraction", "Polymorphism", "Inheritance"], 
        answer: "Encapsulation" 
    },
    { 
        question: "Which of the following is NOT a NoSQL database?", 
        options: ["MongoDB", "Redis", "PostgreSQL", "Cassandra"], 
        answer: "PostgreSQL" 
    },
    { 
        question: "What is the default port for HTTPS?", 
        options: ["80", "443", "22", "53"], 
        answer: "443" 
    },
    { 
        question: "Which AWS service is used for serverless computing?", 
        options: ["EC2", "Lambda", "S3", "DynamoDB"], 
        answer: "Lambda" 
    },
    { 
        question: "In machine learning, what does 'overfitting' mean?", 
        options: ["The model performs poorly on training data", "The model memorizes training data but fails on new data", "The model has too many features", "The model cannot learn patterns"], 
        answer: "The model memorizes training data but fails on new data" 
    },
    { 
        question: "Which programming language is primarily used for developing smart contracts on Ethereum?", 
        options: ["Solidity", "Rust", "Go", "Python"], 
        answer: "Solidity" 
    },
    { 
        question: "Which type of cyberattack involves injecting malicious code into an SQL query?", 
        options: ["Cross-Site Scripting (XSS)", "SQL Injection", "Denial-of-Service (DoS)", "Man-in-the-Middle (MitM)"], 
        answer: "SQL Injection" 
    },
    { 
        question: "Which data structure is used to implement a LIFO (Last In, First Out) system?", 
        options: ["Queue", "Stack", "Heap", "Linked List"], 
        answer: "Stack" 
    },
    { 
        question: "What is the default port for HTTPS?", 
        options: ["80", "443", "22", "53"], 
        answer: "443" 
    },
    { 
        question: "Which of these programming languages is primarily used for statistical computing?", 
        options: ["Python", "Java", "R", "Swift"], 
        answer: "R" 
    },
    { 
        question: "What does RAID 1 do?", 
        options: ["Stripes data across multiple drives", "Mirrors data for redundancy", "Uses parity for error correction", "Combines multiple drives into one logical unit"], 
        answer: "Mirrors data for redundancy" 
    },
    { 
        question: "Which HTTP status code represents 'Not Found'?", 
        options: ["200", "301", "403", "404"], 
        answer: "404" 
    },
    { 
        question: "What is the time complexity of searching for an element in a balanced binary search tree (BST)?", 
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], 
        answer: "O(log n)" 
    },
    { 
        question: "Which JavaScript framework is used for building single-page applications (SPAs)?", 
        options: ["React", "Django", "Flask", "Spring"], 
        answer: "React" 
    },
    { 
        question: "Which cloud model provides virtualized computing resources over the internet?", 
        options: ["IaaS", "PaaS", "SaaS", "FaaS"], 
        answer: "IaaS" 
    },
    { 
        question: "What does 'git rebase' do?", 
        options: ["Merges branches", "Rewrites commit history", "Deletes branches", "Creates a new repository"], 
        answer: "Rewrites commit history" 
    },
    { 
        question: "Which component of Kubernetes is responsible for maintaining desired state?", 
        options: ["Kubelet", "Pod", "Controller", "Scheduler"], 
        answer: "Controller" 
    },
    { 
        question: "Which networking protocol is used for secure remote login?", 
        options: ["HTTP", "FTP", "SSH", "SMTP"], 
        answer: "SSH" 
    },
    { 
        question: "What is the main advantage of using a message queue like RabbitMQ or Kafka?", 
        options: ["Direct communication between microservices", "Asynchronous processing and scalability", "Faster execution than REST APIs", "Ensures data is never lost"], 
        answer: "Asynchronous processing and scalability" 
    },
    { 
        question: "What does the ACID property in databases stand for?", 
        options: ["Atomicity, Consistency, Isolation, Durability", "Automation, Concurrency, Integration, Design", "Asynchronous, Cached, Indexed, Distributed", "Aggregation, Configuration, Integrity, Deployment"], 
        answer: "Atomicity, Consistency, Isolation, Durability" 
    },
    { 
        question: "Which of the following is NOT a front-end JavaScript framework?", 
        options: ["Vue.js", "Angular", "Django", "Svelte"], 
        answer: "Django" 
    },
    { 
        question: "What does CSP stand for in web security?", 
        options: ["Cross-Site Policy", "Content Security Policy", "Client-Side Protection", "Cyber Security Protocol"], 
        answer: "Content Security Policy" 
    },
    { 
        question: "Which database follows a key-value data model?", 
        options: ["MySQL", "PostgreSQL", "Redis", "Oracle"], 
        answer: "Redis" 
    },
    { 
        question: "What is the purpose of Docker?", 
        options: ["Virtualization", "Containerization", "Cloud hosting", "Database management"], 
        answer: "Containerization" 
    },
    { 
        question: "Which programming language is primarily used for developing iOS applications?", 
        options: ["Swift", "Kotlin", "C#", "Java"], 
        answer: "Swift" 
    },
    { 
        question: "Which hashing algorithm is used by Bitcoin?", 
        options: ["SHA-1", "SHA-256", "MD5", "Blowfish"], 
        answer: "SHA-256" 
    }
];

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        questionElement.innerText = `Quiz Over! Your Score: ${score} / ${quizData.length}`;
        optionsElement.innerHTML = "";
        nextButton.style.display = "none";
        timerElement.style.display = "none";
        return;
    }

    const question = quizData[currentQuestionIndex];
    questionElement.innerText = question.question;
    optionsElement.innerHTML = "";

    question.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option");
        button.onclick = () => checkAnswer(option);
        optionsElement.appendChild(button);
    });

    resetTimer();
}

function checkAnswer(selected) {
    clearInterval(timer);
    const correctAnswer = quizData[currentQuestionIndex].answer;
    if (selected === correctAnswer) {
        score++;
        scoreElement.innerText = `Score: ${score}`;
    }
    currentQuestionIndex++;
    loadQuestion();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.innerText = `Time: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            currentQuestionIndex++;
            loadQuestion();
        }
    }, 1000);
}

nextButton.onclick = () => {
    loadQuestion();
};

loadQuestion();
