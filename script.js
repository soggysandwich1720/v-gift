document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const background = document.getElementById('background');
    const proposalText = document.getElementById('proposal-text');
    const buttonGroup = document.getElementById('button-group');
    const bgMusic = document.getElementById('bgm');

    // Fade in audio helper
    function fadeInAudio(audio, duration = 3000) {
        audio.volume = 0;
        audio.play().catch(e => console.log("Music play blocked by browser:", e));

        const start = performance.now();
        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            audio.volume = progress * 0.1;
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    }

    // Floating hearts creation
    let currentEmoji = '❤️';
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = currentEmoji;
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        background.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createHeart, 300);

    // "No" button logic
    let noClickCount = 0;
    let yesScale = 1;

    function handleNoAction() {
        noClickCount++;

        // Increase Yes button size and glow using CSS variables
        yesScale += 0.2;
        const glowIntensity = (noClickCount * 15) + 15;
        yesBtn.style.setProperty('--yes-scale', yesScale);
        yesBtn.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 77, 109, ${0.3 + (noClickCount * 0.1)})`;

        if (noClickCount === 1) {
            noBtn.innerText = "Are you sure? 🥺";
            currentEmoji = '🥺';
        } else if (noClickCount === 2) {
            noBtn.innerText = "Think again! 🤨";
            currentEmoji = '🤨';
        } else if (noClickCount === 3) {
            noBtn.innerText = "Don't be mean! 😭";
            currentEmoji = '😭';
        } else if (noClickCount >= 4) {
            noBtn.innerText = "You're breaking my heart 😭";
            currentEmoji = '😭';

            // Show sad GIF
            const mainImg = document.querySelector('.main-image');
            if (mainImg && !mainImg.src.includes('cute-sad')) {
                mainImg.src = "https://media.tenor.com/925LDfyVUGEAAAAm/cute-sad.webp";
                mainImg.alt = "Cute Sad GIF";
            }

            // Trigger dramatic heartbreak effect
            document.body.classList.add('ashy-mode');
            startRain();
        }
        moveButton();
    }

    let rainInterval;
    function startRain() {
        if (rainInterval) return; // Only start once
        rainInterval = setInterval(() => {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.opacity = Math.random();
            background.appendChild(drop);

            setTimeout(() => {
                drop.remove();
            }, 2000);
        }, 50);
    }

    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleNoAction();
    });
    noBtn.addEventListener('click', handleNoAction);

    function moveButton(e) {
        const yesRect = yesBtn.getBoundingClientRect();
        const padding = 20; // Extra space around Yes button

        let x, y;
        let attempts = 0;

        do {
            x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
            y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
            attempts++;

            // Check if the new position overlaps with the Yes button's area
            const noRect = {
                left: x - padding,
                top: y - padding,
                right: x + noBtn.offsetWidth + padding,
                bottom: y + noBtn.offsetHeight + padding
            };

            const overlaps = !(noRect.right < yesRect.left ||
                noRect.left > yesRect.right ||
                noRect.bottom < yesRect.top ||
                noRect.top > yesRect.bottom);

            if (!overlaps || attempts > 20) break;
        } while (true);

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.transition = 'all 0.4s ease';
    }

    // "Yes" button logic
    yesBtn.addEventListener('click', () => {
        // Clear heartbreak effects if active
        document.body.classList.remove('ashy-mode');
        if (rainInterval) {
            clearInterval(rainInterval);
            rainInterval = null;
            // Remove all existing raindrops
            const raindrops = document.querySelectorAll('.raindrop');
            raindrops.forEach(drop => drop.remove());
        }

        // --- Start/Replay Music with Fade-in (0.5s delay) ---
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
            setTimeout(() => {
                fadeInAudio(bgMusic, 3500);
            }, 500);
        }

        // Change image to success GIF
        const mainImg = document.querySelector('.main-image');
        if (mainImg) {
            mainImg.src = "https://media.tenor.com/3Yml0nL4aBwAAAAi/cosytales-love.gif";
            mainImg.alt = "Success Love GIF";
        }

        // Change background emojis to celebratory ones
        currentEmoji = '💖';

        // Confetti effect
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff8fa3', '#ffccd5', '#ffffff']
        });

        // Change text and state
        proposalText.innerText = "YAYY!! i love you Prakriti 💖";
        proposalText.classList.add('success-text');
        document.body.classList.add('success-bg');

        // Hide button group
        buttonGroup.style.display = 'none';

        // More confetti loop
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // --- Letter Teaser Transition ---
        setTimeout(() => {
            // Keep both: Success bear and letter surprise
            const letterSticker = document.getElementById('letter-sticker');
            const mainImg = document.getElementById('main-image');

            letterSticker.src = "https://media.tenor.com/r2mSqYQUKycAAAAi/raf-rafs.gif";
            letterSticker.classList.remove('hidden');

            proposalText.style.opacity = '0';
            setTimeout(() => {
                proposalText.innerText = "oh wait.. seems like a letter for you";
                proposalText.style.opacity = '1';
                showEnvelope();
            }, 500);
        }, 2000);
    });

    function showEnvelope() {
        const letterContainer = document.getElementById('letter-container');
        const explorerPage = document.getElementById('explorer-page');
        const letterSticker = document.getElementById('letter-sticker');
        const explorerHeartBtn = document.getElementById('explorer-heart-btn');
        const closeBtn = document.getElementById('close-letter');
        const proposalText = document.getElementById('proposal-text');
        const explorerCard = document.querySelector('.explorer-card');
        const explorerMainText = document.querySelector('.explorer-main-text');
        const explorerSubText = document.querySelector('.explorer-sub-text');

        let currentStageIndex = 0;
        let musicStarted = false;
        const bgMusic = document.getElementById('bgm');

        const explorerStages = [
            { mainText: "Hey Are You There?", subText: "Click On The Heart Sign To Explore More" },
            { mainText: "I have a lot to tell you...", subText: "Since the day i met you my life changed..that text on hellotalk which changed my life 💖" },
            { mainText: "I always remember how i was stuttering..", subText: "i still remember how i was so shy and nervous to even talk to you 🌹" },
            { mainText: "But you never let me down", subText: "they way you convinced me to talk to you knowing i was nervous...❤️" },
            { mainText: "Some things can't be forgotten", subText: "those days when we used to talk for hours and hours.. not knowing what to say.. just to hear each others voice..❤️" },
            { mainText: "Eventually, the inevitable happened", subText: "days after days i fell more for you..getting addicted to you..❤️" },
            { mainText: "The pretending lmao", subText: "Funny how i used to drop so obvious hints and you replied with 'ohh it matches with me'..and i used to think why can't she get it that i'm talking about her" },
            { mainText: "How cute and embarassing it was..", subText: "ofcourse you're the one who's smiling cause i was the one who looked like an idiot at that moment.." },
            { mainText: "But i don't mind being an idiot", subText: "if i got 7 more lives.. i'll choose to be the same idiot again and again..❤️" },
            { mainText: "Okay, I won’t take up any more of your time.", subText: "just wanted to let you know that how much i love you..you're the sweetest person i've ever met.. ❤️" },
            { mainText: "And yeah, SORRY..", subText: "sorry for whatever i did..sorry for how i acted..sorry for not being the rukku you wanted..❤️" },
            { mainText: "But i promise", subText: "i'm trying to be the best for you and i will..till my last breath..❤️" },
            { mainText: "Manifesting so hard", subText: "i hope this distance between us ends soon..and i get to wake up knowing i live in the same city as you..and i overcome my insecurities..❤️" },
            { mainText: "Okay this is the last slide i promise", subText: "i tried writing a letter to you..even though i can't express my feelings in words..i hope you get the message❤️" }
        ];

        const openExplorer = () => {
            if (explorerPage.classList.contains('hidden')) {
                // Always start from the beginning
                currentStageIndex = 0;
                explorerMainText.innerText = explorerStages[0].mainText;
                explorerSubText.innerText = explorerStages[0].subText;
                explorerCard.style.opacity = '1';

                explorerPage.classList.remove('hidden');
                letterSticker.classList.add('shrunk-corner');
                proposalText.style.opacity = '0';
                setTimeout(() => {
                    explorerPage.style.opacity = '1';
                }, 10);
            }
        };

        const updateExplorerContent = () => {
            currentStageIndex++;
            if (currentStageIndex < explorerStages.length) {
                // Smooth transition between stages
                explorerCard.style.opacity = '0';
                setTimeout(() => {
                    explorerMainText.innerText = explorerStages[currentStageIndex].mainText;
                    explorerSubText.innerText = explorerStages[currentStageIndex].subText;
                    explorerCard.style.opacity = '1';
                }, 400);
            } else {
                openLetter();
            }
        };

        const openLetter = () => {
            letterContainer.classList.remove('hidden');
            setTimeout(() => {
                letterContainer.style.opacity = '1';
                explorerPage.style.opacity = '0';
                setTimeout(() => explorerPage.classList.add('hidden'), 500);
            }, 10);

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4d6d', '#ff8fa3', '#ffffff']
            });
        };

        const closeExplorer = () => {
            explorerPage.style.opacity = '0';
            letterSticker.classList.add('shrunk-corner');
            proposalText.innerText = "YAYY!! i love you Prakriti 💖";
            proposalText.style.opacity = '1';
            setTimeout(() => {
                explorerPage.classList.add('hidden');
            }, 500);
        };

        const closeLetter = () => {
            letterContainer.style.opacity = '0';
            letterSticker.classList.add('shrunk-corner');
            proposalText.innerText = "YAYY!! i love you Prakriti 💖";
            proposalText.style.opacity = '1';
            setTimeout(() => {
                letterContainer.classList.add('hidden');
            }, 500);
        };

        letterSticker.addEventListener('click', openExplorer);
        explorerHeartBtn.addEventListener('click', updateExplorerContent);
        closeBtn.addEventListener('click', closeLetter);
        document.getElementById('close-explorer').addEventListener('click', closeExplorer);
    }
});
