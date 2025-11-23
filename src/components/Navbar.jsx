import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const links = [
        { name: 'Hizmetler', section: 1 },
        { name: 'Portfolyo', section: 3 },
        { name: 'İletişim', section: 5 }
    ];
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = (sectionIndex) => {
        // Dispatch custom event to trigger section change
        window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { section: sectionIndex } }));
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                padding: '2rem',
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'space-between',
                alignItems: 'center',
                zIndex: 100,
                mixBlendMode: 'difference',
                color: 'var(--color-text)'
            }}
        >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.05em' }}>
                HASEKUI
            </div>
            {!isMobile && (
                <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
                    {links.map((link) => (
                        <li key={link.name}>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(link.section);
                                }}
                                href="#"
                                style={{
                                    position: 'relative',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer'
                                }}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </motion.nav>
    );
};

export default Navbar;
