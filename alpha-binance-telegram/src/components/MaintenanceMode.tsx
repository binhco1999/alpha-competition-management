import { useState, useEffect } from "react";

interface MaintenanceModeProps {
    isMaintenanceMode: boolean;
    onToggleMaintenance: () => void;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
    isMaintenanceMode,
    onToggleMaintenance
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!isMaintenanceMode) {
        return null;
    }

    return (
        <div className="min-h-screen p-2 wrapper-project">
            <main className="max-w-md mx-auto p-4">
                {/* Header with toggle button */}
                {/* <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Maintenance Mode</h1>
                    <button
                        onClick={onToggleMaintenance}
                        className="mode-toggle-btn px-3 py-1 text-sm font-medium rounded border transition-colors bg-green-500 text-white border-green-500 hover:bg-green-600"
                        title="Exit maintenance mode"
                    >
                        Exit Maintenance
                    </button>
                </div> */}

                {/* Maintenance Content */}
                <div className="maintenance-container">
                    {/* Status Card */}
                    <div className="maintenance-card">
                        <div className="maintenance-icon">🔧</div>
                        <h2 className="maintenance-title">TẠM DỪNG HỆ THỐNG</h2>

                        <p className="maintenance-description">
                            Hệ thống đang bị tạm dừng do chính sách của nhà cung cấp dịch vụ lấy giá token đã thay đổi, chúng tôi sẽ sớm trở lại (nếu có thể), cảm ơn bạn đã sử dụng dịch vụ của 71 Ambition.
                        </p>
                        <h2 className="maintenance-title">SYSTEM MAINTENANCE</h2>
                        <p className="maintenance-description">
                            System is down due to a change in the policy of the token price provider, we will be back soon (if possible), thank you for using the services of 71 Ambition.
                        </p>
                    </div>

                    {/* Time Display */}
                    <div className="maintenance-card">
                        <div className="maintenance-icon">⏰</div>
                        <h3 className="maintenance-subtitle">Thời gian hiện tại</h3>
                        <div className="time-display">
                            {currentTime.toLocaleString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                timeZoneName: 'short'
                            })}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="maintenance-card">
                        <div className="maintenance-icon">📊</div>
                        <h3 className="maintenance-subtitle">Quá trình bảo trì</h3>
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <div className="progress-text">Hoàn thành ước tính: 5%</div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="maintenance-card">
                        <div className="maintenance-icon">📞</div>
                        <h3 className="maintenance-subtitle">Trợ giúp?</h3>
                        <p className="maintenance-description">
                            Nếu bạn có câu hỏi quan trọng trong thời gian bảo trì, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi.
                        </p>
                        <p className="maintenance-description">
                            If you have urgent questions during maintenance, please contact our support team.
                        </p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <span className="contact-label">Email:</span>
                                <span className="contact-value">tranbinhco.work@gmail.com</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Telegram:</span>
                                <span className="contact-value">t.me/seventyoneonair</span>
                            </div>
                        </div>
                    </div>

                    {/* Features Preview */}
                    <div className="maintenance-card">
                        <div className="maintenance-icon">✨</div>
                        <h3 className="maintenance-subtitle">Những điều sắp tới...</h3>
                        <ul className="features-list">
                            <li className="feature-item">🚀 Cập nhật API lấy giá</li>
                            <li className="feature-item">📱 Cải thiện hiệu năng</li>
                            <li className="feature-item">🎯 Chức năng diễn đàn</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="maintenance-footer">
                    <p className="footer-text">
                        Cảm ơn bạn đã kiên nhẫn. Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn trải nghiệm tốt nhất.
                    </p>
                    <p className="footer-text">
                        Thank you for your patience. We're working hard to bring you the best experience.
                    </p>
                    <div className="footer-brand">© 71 Ambition - Maintenance</div>
                </div>
            </main>
        </div>
    );
};

export default MaintenanceMode;
