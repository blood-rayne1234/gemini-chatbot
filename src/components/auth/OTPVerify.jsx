import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phone || 'your number';

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (otp === '123456') {
        setAuth({ phone: phoneNumber }, 'mock-auth-token');
        toast.success('Verified successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    toast.success(`New OTP sent to ${phoneNumber}`);
    setCountdown(30);
    setOtp('');
  };

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>
      <p className="otp-instructions">
        Enter the 6-digit code sent to <br/>
        <span className="phone-number">{phoneNumber}</span>
      </p>
      
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        maxLength={6}
        placeholder="123456"
        className="otp-input"
      />
      
      <button 
        onClick={handleVerify}
        disabled={isLoading || otp.length !== 6}
        className="verify-btn"
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
      
      <div className="resend-otp">
        {countdown > 0 ? (
          <span>Resend OTP in {countdown}s</span>
        ) : (
          <button 
            onClick={handleResendOTP}
            className="resend-btn"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};