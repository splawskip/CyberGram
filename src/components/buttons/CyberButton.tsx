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
      {loading ? <img className="w-full h-full p-1" loading="lazy" src="/assets/icons/loader.svg" alt="loader" width={12} height={12} /> : children}
      <span aria-hidden>_</span>
      <span aria-hidden className="cyber-btn__glitch">
        {loading ? <img className="w-full h-full p-1" loading="lazy" src="/assets/icons/loader.svg" alt="loader" width={12} height={12} /> : children}
      </span>
      <span aria-hidden className="cyber-btn__tag">R2137</span>
    </button>
  );
}

CyberButton.defaultProps = defaultProps;

export default CyberButton;
