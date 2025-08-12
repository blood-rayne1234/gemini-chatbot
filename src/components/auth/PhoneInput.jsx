import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
});

export const PhoneInput = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    toast.success(`OTP sent to ${data.phone}`);
    setTimeout(() => {
      navigate('/verify', { state: { phone: data.phone } });
    }, 1500);
  };

  return (
    <div className="auth-container">
      <h2>Enter Your Phone</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input 
          {...register('phone')} 
          placeholder="Enter phone number" 
          className="phone-input"
        />
        {errors.phone && <p className="error">{errors.phone.message}</p>}
        <button type="submit" className="submit-btn">Send OTP</button>
      </form>
    </div>
  );
};