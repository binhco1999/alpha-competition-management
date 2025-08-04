import { useState, useEffect, useCallback } from 'react';

interface MysteryBoxProps {
    onClose: () => void;
}

const MysteryBox: React.FC<MysteryBoxProps> = ({ onClose }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [showGiftCode, setShowGiftCode] = useState(false);
    const [showDisqualified, setShowDisqualified] = useState(false);
    const [fireworkParticles, setFireworkParticles] = useState<any[]>([]);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [captchaProblem, setCaptchaProblem] = useState({ num1: 0, num2: 0, operator: '+' });
    const [captchaError, setCaptchaError] = useState('');
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [giftCode] = useState(() => {
        // Generate a random 8-character gift code
        // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        // return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return 'MIZXZAWO';
    });

    // Generate random position
    const generateRandomPosition = useCallback(() => {
        const maxX = window.innerWidth - 100; // Account for box size
        const maxY = window.innerHeight - 100;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        return { x, y };
    }, []);

    // Generate captcha problem
    const generateCaptchaProblem = useCallback(() => {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operators = ['+', '-', '×'];
        const operator = operators[Math.floor(Math.random() * operators.length)];

        setCaptchaProblem({ num1, num2, operator });
        setCaptchaAnswer('');
        setCaptchaError('');
    }, []);

    // Check if user is disqualified
    const checkDisqualified = useCallback(() => {
        const disqualifiedAt = localStorage.getItem('mysteryBoxDisqualifiedAt');
        if (disqualifiedAt) {
            const timeDiff = Date.now() - parseInt(disqualifiedAt, 10);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            if (hoursDiff < 24) {
                return true; // Still disqualified
            } else {
                // Remove disqualification after 24 hours
                localStorage.removeItem('mysteryBoxDisqualifiedAt');
                localStorage.removeItem('mysteryBoxWrongAttempts');
            }
        }
        return false;
    }, []);

    // Show mystery box at random intervals
    useEffect(() => {
        // Check if user is disqualified
        if (checkDisqualified()) {
            return; // Don't show the box if disqualified
        }

        const showBox = () => {
            setPosition(generateRandomPosition());
            setIsVisible(true);
            setIsClicked(false);
            setShowFireworks(false);
            setShowCaptcha(false);
            setShowGiftCode(false);
            setShowDisqualified(false);
            setFireworkParticles([]);
            setWrongAttempts(0);
        };

        // Show box after 3-10 seconds
        const initialDelay = Math.random() * 7000 + 3000;
        const timer = setTimeout(showBox, initialDelay);

        return () => clearTimeout(timer);
    }, [generateRandomPosition, checkDisqualified]);

    // Handle fireworks animation
    useEffect(() => {
        if (showFireworks) {
            console.log('Generating fireworks...');
            const particles = generateFireworkParticles();
            console.log('Generated particles:', particles.length);
            setFireworkParticles(particles);

            // Animate particles after a short delay
            setTimeout(() => {
                console.log('Animating particles...');
                setFireworkParticles(prev =>
                    prev.map(particle => ({
                        ...particle,
                        animated: true
                    }))
                );

                // Fallback: manually animate particles using DOM manipulation
                setTimeout(() => {
                    const particleElements = document.querySelectorAll('.firework-particle');
                    particleElements.forEach((element, index) => {
                        const particle = particles[index];
                        if (particle && element instanceof HTMLElement) {
                            element.style.transform = `translate(${particle.finalX}px, ${particle.finalY}px) scale(0)`;
                            element.style.opacity = '0';
                        }
                    });
                }, 50);
            }, 100);
        }
    }, [showFireworks]);

    const handleClick = () => {
        if (isClicked) return;

        // Scroll to top when box is clicked
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('Mystery box clicked!');
        setIsClicked(true);
        setShowFireworks(true);

        // Show captcha after firework animation
        setTimeout(() => {
            console.log('Showing captcha...');
            generateCaptchaProblem();
            setShowCaptcha(true);
        }, 2000);
    };

    const handleCaptchaSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let correctAnswer: number;
        switch (captchaProblem.operator) {
            case '+':
                correctAnswer = captchaProblem.num1 + captchaProblem.num2;
                break;
            case '-':
                correctAnswer = captchaProblem.num1 - captchaProblem.num2;
                break;
            case '×':
                correctAnswer = captchaProblem.num1 * captchaProblem.num2;
                break;
            default:
                correctAnswer = captchaProblem.num1 + captchaProblem.num2;
        }

        if (parseInt(captchaAnswer) === correctAnswer) {
            setShowCaptcha(false);
            setShowGiftCode(true);
            // Reset wrong attempts on success
            setWrongAttempts(0);
            localStorage.removeItem('mysteryBoxWrongAttempts');
        } else {
            const newWrongAttempts = wrongAttempts + 1;
            setWrongAttempts(newWrongAttempts);

            if (newWrongAttempts >= 3) {
                // User is disqualified
                setShowCaptcha(false);
                setShowDisqualified(true);
                localStorage.setItem('mysteryBoxDisqualifiedAt', Date.now().toString());
                localStorage.setItem('mysteryBoxWrongAttempts', newWrongAttempts.toString());

                // Auto close after 3 seconds
                setTimeout(() => {
                    setShowDisqualified(false);
                    setIsVisible(false);
                    onClose();
                }, 3000);
            } else {
                setCaptchaError(`Incorrect answer. ${3 - newWrongAttempts} attempts remaining.`);
                generateCaptchaProblem();
                localStorage.setItem('mysteryBoxWrongAttempts', newWrongAttempts.toString());
            }
        }
    };

    // Generate firework particles with random angles
    const generateFireworkParticles = () => {
        const particles = [];
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 6; // Increased size: 6-14px
            const delay = Math.random() * 0.5;

            // Simple random direction
            const angle = Math.random() * 360;
            const distance = 100 + Math.random() * 50;
            const finalX = Math.cos((angle * Math.PI) / 180) * distance;
            const finalY = Math.sin((angle * Math.PI) / 180) * distance;

            particles.push({
                id: i,
                color,
                size,
                delay,
                finalX,
                finalY
            });
        }

        return particles;
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Mystery Box */}
            <div
                className={`mystery-box-container ${isClicked ? 'clicked' : 'visible'}`}
                style={{
                    left: position.x,
                    top: position.y,
                }}
                onClick={handleClick}
            >
                <div className="the-gift-box relative">
                    {/* Box shadow */}
                    <div className="box-shadow"></div>

                    {/* Mystery box */}
                    <div className="gift-box-inner">
                        <div className="gift-emoji">
                            <span>🎁</span>
                        </div>
                        {/* Sparkle effect */}
                        <div className="sparkle sparkle-top"></div>
                        <div className="sparkle sparkle-bottom"></div>
                    </div>

                    {/* Click hint */}
                    <div className="click-hint">
                        Click me!
                    </div>
                </div>
            </div>

            {/* Fireworks Effect */}
            {showFireworks && (
                <div className="fireworks-container">
                    <div
                        className="debug-indicator"
                        style={{
                            left: position.x + 40,
                            top: position.y + 40,
                        }}
                    >
                        {/* Debug indicator */}
                    </div>
                    {fireworkParticles.map((particle) => (
                        <div
                            key={particle.id}
                            className={`firework-particle ${particle.animated ? 'animated' : 'initial'}`}
                            style={{
                                left: position.x + 40,
                                top: position.y + 40,
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: particle.color,
                                border: '2px solid white',
                                '--final-x': `${particle.finalX}px`,
                                '--final-y': `${particle.finalY}px`,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            )}

            {/* Captcha Modal */}
            {showCaptcha && (
                <div className="modal-overlay">
                    <div className="gift-code-modal">
                        {/* Close button in top right */}
                        <button
                            onClick={() => {
                                setShowCaptcha(false);
                                setIsVisible(false);
                                onClose();
                            }}
                            className="close-btn"
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2>Bạn có phải là robot?</h2>
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg mb-4 flex flex-col items-center w-full">
                            <div className="text-sm mb-2">Giải bài toán để nhận quà:</div>
                            <div className="captcha-problem text-2xl font-bold">
                                {captchaProblem.num1} {captchaProblem.operator} {captchaProblem.num2} = ?
                            </div>
                            <div className="text-xs mt-2 opacity-75">
                                Số lần sai: {wrongAttempts}/3
                            </div>
                        </div>
                        <form onSubmit={handleCaptchaSubmit} className="w-full">
                            <div className="mb-4">
                                <input
                                    type="number"
                                    value={captchaAnswer}
                                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                                    placeholder="Nhập câu trả lời"
                                    className="search-input answer-input"
                                    required
                                />
                                {captchaError && (
                                    <div className="text-red-500 text-sm mt-2">{captchaError}</div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="mode-toggle-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Gửi câu trả lời
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Disqualified Modal */}
            {showDisqualified && (
                <div className="modal-overlay">
                    <div className="gift-code-modal">
                        <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-lg mb-4 flex flex-col items-center w-full">
                            <div className="text-4xl mb-4">❌</div>
                            <h2 className="text-xl font-bold mb-2">Không đủ điều kiện nhận quà</h2>
                            <div className="text-center text-sm opacity-90">
                                Bạn đã sai 3 lần. Vui lòng thử lại sau 24 giờ.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gift Code Modal */}
            {showGiftCode && (
                <div className="modal-overlay">
                    <div className="gift-code-modal">
                        {/* Close button in top right */}
                        <button
                            onClick={() => {
                                setShowGiftCode(false);
                                setIsVisible(false);
                                onClose();
                            }}
                            className="close-btn"
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2>71 Ambition chúc mừng!</h2>
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg mb-4 flex flex-col items-center w-full">
                            <div className="text-sm mb-2">Binance gift code:</div>
                            <div className="gift-code-box">{giftCode}</div>
                        </div>
                        <div className="note">
                            Sử dụng trong app <span className="font-semibold text-black">Binance</span> để nhận.<br />
                            <span className="subnote">(Mã quà là duy nhất và chỉ có thể sử dụng một lần.</span>
                            <span className="subnote"> Cảm ơn bạn đã trải nghiệm sản phẩm của chúng tôi!)</span>
                        </div>
                        {/* Copy button */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(giftCode);
                                alert('Gift code copied to clipboard!');
                            }}
                            className="copy-btn"
                        >
                            Copy Code
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MysteryBox; 