document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Popup Styles */
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(6, 17, 33, 0.6);
            backdrop-filter: blur(3px);
            z-index: 1000;
            animation: fadeIn 0.4s ease-out;
        }

        .popup-content {
            background-color: var(--bg-navy);
            border: 2px solid var(--border-yellow);
            max-width: 500px;
            width: 90%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            max-height: 90vh; /* Prevent overflowing screen on mobile */
        }

        .window-header {
            background-color: var(--border-yellow);
            color: var(--bg-navy);
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: var(--font-heading);
            cursor: grab;
            user-select: none;
            border-bottom: 2px solid var(--border-yellow);
        }

        .window-header:active {
            cursor: grabbing;
        }

        .window-title {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .popup-close {
            background: var(--bg-navy);
            border: 2px solid var(--bg-navy);
            color: var(--border-yellow);
            font-size: 1.2rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .popup-close:hover {
            background: var(--border-red);
            color: var(--text-white);
            border-color: var(--border-red);
        }

        .window-body {
            padding: 2rem;
            text-align: center;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            overflow-y: auto; /* Allow scroll if content is too tall on mobile */
        }

        .popup-image {
            width: 100%;
            height: auto;
            max-height: 180px;
            object-fit: cover;
            border: 2px solid var(--border-yellow);
            margin-bottom: 1rem;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
        }

        .popup-title {
            font-family: var(--font-heading);
            color: var(--border-yellow);
            font-size: 1.6rem;
            margin-bottom: 0.8rem;
            text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
        }

        .popup-text {
            font-family: var(--font-mono);
            color: var(--text-white);
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 1.5rem;
        }

        .popup-btn {
            display: inline-block;
            background-color: var(--border-yellow);
            color: var(--bg-navy);
            font-family: var(--font-heading);
            font-size: 1rem;
            padding: 10px 20px;
            text-decoration: none;
            transition: all 0.3s ease;
            border: 2px solid var(--border-yellow);
        }

        .popup-btn:hover {
            background-color: transparent;
            color: var(--border-yellow);
            box-shadow: 0 0 15px rgba(245, 196, 94, 0.4);
        }

        @media (max-width: 600px) {
            .window-body {
                padding: 1.2rem;
            }
            .popup-title {
                font-size: 1.4rem;
            }
            .popup-image {
                max-height: 140px;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const popupHtml = `
    <div id="welcome-popup" class="popup-overlay" style="display: none;">
        <div class="popup-content" id="popup-window">
            <div class="window-header" id="popup-header">
                <span class="window-title">system_message.exe</span>
                <button class="popup-close" id="close-popup" aria-label="Close popup">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="window-body">
                <img src="assets/ctf_blog_cover.jpg" alt="CTF Cyberpunk Cover" class="popup-image">
                <h2 class="popup-title">FOR BEGINNERS!</h2>
                <p class="popup-text">Hãy tham khảo sau đây dành cho tân sinh viên nhé!</p>
                <a href="views/posts/hoc-an-toan-thong-tin-bat-dau-tu-dau-va-nhu-the-nao.html" class="popup-btn">
                    Xem lộ trình ngay <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);

    // 3. JS Logic
    const popup = document.getElementById('welcome-popup');
    const closeBtn = document.getElementById('close-popup');
    const popupWindow = document.getElementById('popup-window');
    const popupHeader = document.getElementById('popup-header');
    
    // Show popup if not seen in this session
    if (!sessionStorage.getItem('welcomePopupSeen')) {
        setTimeout(() => {
            popup.style.display = 'block';
        }, 800);
    }
    
    // Close popup function to avoid backdrop-filter rendering bug on canvas
    const closePopup = () => {
        popup.style.opacity = '0';
        popup.style.pointerEvents = 'none';
        popup.style.visibility = 'hidden';
        sessionStorage.setItem('welcomePopupSeen', 'true');
    };

    // Close popup
    closeBtn.addEventListener('click', closePopup);
    
    // Close on outside click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    popupHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
    
    // Touch support for mobile dragging
    popupHeader.addEventListener('touchstart', dragStart, {passive: false});
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchmove', drag, {passive: false});

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === popupHeader || popupHeader.contains(e.target)) {
            // Don't drag if clicking the close button
            if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
                isDragging = true;
            }
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            
            popupWindow.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        }
    }
});
