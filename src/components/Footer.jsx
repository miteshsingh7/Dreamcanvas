const footerLinks = {
  Product: [
    { label: 'Generator', href: '#' },
    { label: 'Gallery', href: '#' },
    { label: 'Models', href: '#' },
  ],
  Resources: [
    { label: 'API Status', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'GitHub', href: '#' },
  ],
  Legal: [
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Branding */}
          <div className="md:col-span-1">
            <span className="font-display font-bold text-white text-xl block mb-4">
              DreamCanvas
            </span>
            <p className="text-gray-500 text-sm leading-relaxed">
              AI-powered wallpaper generation
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-gray-300 font-medium text-sm uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-500 hover:text-orange-400 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-gray-600 text-sm text-center">
            © 2024 DreamCanvas · Powered by Pollinations.ai
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
