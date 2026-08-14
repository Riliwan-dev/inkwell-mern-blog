const Footer = () => (
  <footer className="border-t border-line dark:border-line-dark mt-24">
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-soft dark:text-paper/60">
      <p>© {new Date().getFullYear()} Inkwell. Built with the MERN stack.</p>
      <p className="font-display italic">Words, well kept.</p>
    </div>
  </footer>
);

export default Footer;
