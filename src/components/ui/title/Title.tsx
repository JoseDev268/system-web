import { titleFont } from '@/config/fonts';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={`mt-3 ${className}`}>
      {/* Título principal */}
      <h1
        className={`${titleFont.className} antialiased text-4xl font-semibold my-7`}
      >
        {title}
      </h1>

      {/* Subtítulo (opcional) */}
      {subtitle && (
        <h3 className="text-xl mb-5 text-gray-600">{subtitle}</h3>
      )}
    </div>
  );
};