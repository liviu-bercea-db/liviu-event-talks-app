const fs = require('fs');

const talksData = [
  {
    title: "The Future of AI in Software Development",
    speakers: ["Dr. Ava Turing"],
    category: ["AI", "Software Engineering", "Future Tech"],
    description: "An insightful look into how artificial intelligence is shaping the landscape of software development, from automated code generation to intelligent debugging.",
  },
  {
    title: "Mastering Microservices with Node.js",
    speakers: ["John Doe", "Jane Smith"],
    category: ["Node.js", "Microservices", "Backend"],
    description: "Learn best practices for building scalable and resilient microservices architectures using Node.js and related ecosystem tools.",
  },
  {
    title: "Frontend Performance Optimization Techniques",
    speakers: ["Emily White"],
    category: ["Frontend", "Performance", "Web Development"],
    description: "Dive deep into advanced techniques to optimize the performance of your web applications, ensuring a smooth user experience.",
  },
  {
    title: "Cybersecurity Essentials for Developers",
    speakers: ["Robert Black"],
    category: ["Security", "Development", "Best Practices"],
    description: "A crucial session covering fundamental cybersecurity practices that every developer should know to build secure applications.",
  },
  {
    title: "Data Science for Non-Data Scientists",
    speakers: ["Sarah Green", "David Blue"],
    category: ["Data Science", "Analytics", "Introduction"],
    description: "An accessible introduction to data science concepts and tools for developers and professionals without a dedicated data science background.",
  },
  {
    title: "Cloud Native Architectures with Kubernetes",
    speakers: ["Michael Brown"],
    category: ["Cloud", "Kubernetes", "DevOps"],
    description: "Explore the principles of cloud-native development and how Kubernetes can be leveraged to deploy, manage, and scale containerized applications.",
  },
];

const generateHtml = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Talks Event Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }

        #app {
            background-color: #fff;
            max-width: 900px;
            margin: 20px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        header {
            text-align: center;
            margin-bottom: 30px;
        }

        h1 {
            color: #333;
            margin-bottom: 20px;
        }

        #categorySearch {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }

        .talk-card {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 15px 20px;
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
        }

        .talk-card.lunch-break {
            background-color: #dff0d8; /* Light green for lunch */
            border-color: #d6e9c6;
            text-align: center;
            font-weight: bold;
            justify-content: center;
            align-items: center;
        }

        .talk-card h2 {
            color: #0056b3;
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1.4em;
        }

        .talk-card .time {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .talk-card .speakers {
            font-style: italic;
            margin-bottom: 5px;
            color: #555;
        }

        .talk-card .category {
            font-size: 0.85em;
            color: #007bff;
            margin-bottom: 10px;
        }

        .talk-card .description {
            font-size: 0.95em;
            line-height: 1.5;
        }

        .talk-card .no-talk {
            color: #999;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div id="app">
        <header>
            <h1>Tech Talks Event Schedule</h1>
            <input type="text" id="categorySearch" placeholder="Search by category...">
        </header>
        <main id="schedule"></main>
    </div>

    <script>
        const talksData = ${JSON.stringify(talksData, null, 2)};
        
        function formatTime(date) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return hours + ':' + minutes;
        }

        function renderSchedule(filterCategory = '') {
            const scheduleDiv = document.getElementById('schedule');
            scheduleDiv.innerHTML = ''; // Clear previous schedule

            let currentTime = new Date();
            currentTime.setHours(10, 0, 0); // Event starts at 10:00 AM

            const talksPerSession = 3;
            const talkDuration = 60; // minutes
            const transitionDuration = 10; // minutes
            const lunchDuration = 60; // minutes

            let talkIndex = 0;

            for (let i = 0; i < talksData.length + 1; i++) { // +1 to account for lunch break
                const talkCard = document.createElement('div');
                talkCard.classList.add('talk-card');

                if (i === talksPerSession) { // Insert lunch break after the 3rd talk
                    const lunchStartTime = new Date(currentTime);
                    currentTime.setMinutes(currentTime.getMinutes() + lunchDuration);
                    const lunchEndTime = new Date(currentTime);

                    talkCard.classList.add('lunch-break');
                    talkCard.innerHTML = '<h2>Lunch Break</h2>' +
                                         '<p class="time">' + formatTime(lunchStartTime) + ' - ' + formatTime(lunchEndTime) + '</p>';
                    scheduleDiv.appendChild(talkCard);

                    // Add transition after lunch
                    currentTime.setMinutes(currentTime.getMinutes() + transitionDuration);
                    continue; // Skip to the next iteration for talks
                }

                const currentTalk = talksData[talkIndex];

                if (currentTalk) {
                    const talkStartTime = new Date(currentTime);
                    currentTime.setMinutes(currentTime.getMinutes() + talkDuration);
                    const talkEndTime = new Date(currentTime);

                    const categories = currentTalk.category.map(cat => '<span class="category-tag">' + cat + '</span>').join(' ');

                    const speakerHtml = currentTalk.speakers.length > 0
                        ? '<p class="speakers">Speaker(s): ' + currentTalk.speakers.join(', ') + '</p>'
                        : '';

                    const matchesCategory = filterCategory === '' ||
                                            currentTalk.category.some(cat => cat.toLowerCase().includes(filterCategory.toLowerCase()));

                    if (matchesCategory) {
                        talkCard.innerHTML = '<p class="time">' + formatTime(talkStartTime) + ' - ' + formatTime(talkEndTime) + '</p>' +
                                             '<h2>' + currentTalk.title + '</h2>' +
                                             speakerHtml +
                                             '<p class="category">Categories: ' + categories + '</p>' +
                                             '<p class="description">' + currentTalk.description + '</p>';
                        scheduleDiv.appendChild(talkCard);
                    } else {
                        // If it doesn't match and a filter is active, display a placeholder or nothing
                    }
                    talkIndex++; // Move to the next talk
                } else {
                    talkCard.innerHTML = '<p class="no-talk">No talk scheduled for this slot.</p>';
                    scheduleDiv.appendChild(talkCard);
                }


                // Add transition after each talk, except the last one
                if (talkIndex < talksData.length) {
                    currentTime.setMinutes(currentTime.getMinutes() + transitionDuration);
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderSchedule();

            const categorySearchInput = document.getElementById('categorySearch');
            categorySearchInput.addEventListener('keyup', (event) => {
                renderSchedule(event.target.value);
            });
        });
    </script>
</body>
</html>
