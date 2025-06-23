interface DetailSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const DetailSection = ({ title, icon, children }: DetailSectionProps) => (
  <section className="mb-6 bg-gradient-to-br from-[#121826] via-[#1a2337] to-[#1e2b40] rounded-2xl p-6 text-white shadow-[0_4px_20px_rgba(61,217,235,0.08)] ring-1 ring-white/10">
    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

export default DetailSection;
