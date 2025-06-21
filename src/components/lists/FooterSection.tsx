interface Props {
  isEmpty: boolean;
  onStartWizard: () => void;
}

export default function FooterSection({ isEmpty, onStartWizard }: Props) {
  if (isEmpty) return null;

  return (
    <footer className="w-full mt-5 flex flex-col sm:flex-row justify-end items-center gap-4">
      <button
        onClick={onStartWizard}
        className="rounded-lg px-5 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 hover:shadow-xl transition"
      >
        📋 Tomar atención
      </button>
    </footer>
  );
}
