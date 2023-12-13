import Loader from '../shared/Loader';
import { CyberButtonProps } from '@/types';

const defaultProps: Partial<CyberButtonProps> = {
  disabled: false,
  loading: false,
  variant: 'warn',
};

function CyberButton({
  children, disabled = false, loading = false, variant = 'warn',
} : CyberButtonProps) {
  return (
    <button type="submit" className={`cyber-btn cyber-btn--${variant} whitespace-nowrap`} disabled={disabled}>
      {loading && <Loader />}
      {children}
      <span aria-hidden>_</span>
      <span aria-hidden className="cyber-btn__glitch">
        {loading && <Loader />}
        {children}
      </span>
      <span aria-hidden className="cyber-btn__tag">R2137</span>
    </button>
  );
}

CyberButton.defaultProps = defaultProps;

export default CyberButton;
