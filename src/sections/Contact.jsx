import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
    const [showForm, setShowForm] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [formData, setFormData] = useState({
        name: '',
        field: '',
        phone: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Check if Supabase is configured
            if (!supabase) {
                console.log('Form data (Supabase not configured):', formData);
                setSubmitStatus('success');
                setFormData({ name: '', field: '', phone: '', email: '' });

                setTimeout(() => {
                    setShowForm(false);
                    setSubmitStatus(null);
                }, 2000);
                return;
            }

            const { data, error } = await supabase
                .from('contacts')
                .insert([
                    {
                        name: formData.name,
                        field: formData.field,
                        phone: formData.phone,
                        email: formData.email,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            setSubmitStatus('success');
            setFormData({ name: '', field: '', phone: '', email: '' });

            setTimeout(() => {
                setShowForm(false);
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!showForm) return;

        const handleScroll = () => {
            setShowForm(false);
        };

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('touchmove', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, [showForm]);

    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            position: 'relative',
            overflow: 'hidden',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, #ff006620, #00ff9d10, transparent 70%)',
                filter: 'blur(100px)',
                animation: 'pulse 4s ease-in-out infinite'
            }} />

            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                opacity: 0.3,
                mixBlendMode: 'overlay'
            }} />

            <AnimatePresence mode="wait">
                {!showForm ? (
                    <motion.button
                        key="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => setShowForm(true)}
                        style={{
                            position: 'relative',
                            padding: isMobile ? '1.5rem 3rem' : '2.5rem 5rem',
                            fontSize: isMobile ? '1.5rem' : 'clamp(2rem, 4vw, 3.5rem)',
                            fontWeight: '700',
                            color: '#fff',
                            background: 'linear-gradient(135deg, #ff0066, #00ff9d, #0066ff)',
                            backgroundSize: '200% 200%',
                            border: 'none',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            boxShadow: '0 0 60px rgba(255,0,102,0.5), 0 0 100px rgba(0,255,157,0.3)',
                            animation: 'gradientShift 3s ease infinite, float 3s ease-in-out infinite',
                            zIndex: 1,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 0 80px rgba(255,0,102,0.7), 0 0 120px rgba(0,255,157,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 0 60px rgba(255,0,102,0.5), 0 0 100px rgba(0,255,157,0.3)';
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
                            opacity: 0.4,
                            mixBlendMode: 'overlay',
                            pointerEvents: 'none'
                        }} />

                        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Sparkles size={40} />
                            Bir Fikrim Var
                        </span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            padding: '2rem',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                        }}
                    >
                        <h2 style={{
                            fontSize: '1.5rem',
                            marginBottom: '0.5rem',
                            color: '#fff',
                            fontWeight: '400',
                            textAlign: 'center'
                        }}>
                            Sizi Arayalım
                        </h2>

                        <a
                            href="tel:05456119952"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontSize: '1.1rem',
                                color: '#00ff9d',
                                textDecoration: 'none',
                                marginBottom: '1.5rem',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#00ffcc'}
                            onMouseLeave={(e) => e.target.style.color = '#00ff9d'}
                        >
                            <Phone size={20} />
                            0545 611 99 52
                        </a>

                        {submitStatus === 'success' && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(0, 255, 157, 0.1)',
                                border: '1px solid rgba(0, 255, 157, 0.3)',
                                borderRadius: '8px',
                                color: '#00ff9d',
                                textAlign: 'center',
                                marginBottom: '1rem',
                                fontSize: '0.9rem'
                            }}>
                                ✓ Mesajınız başarıyla gönderildi!
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(255, 0, 102, 0.1)',
                                border: '1px solid rgba(255, 0, 102, 0.3)',
                                borderRadius: '8px',
                                color: '#ff0066',
                                textAlign: 'center',
                                marginBottom: '1rem',
                                fontSize: '0.9rem'
                            }}>
                                ✗ Bir hata oluştu. Lütfen tekrar deneyin.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="İsim Soyisim"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                            />

                            <input
                                type="text"
                                placeholder="Alan"
                                value={formData.field}
                                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                                required
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                            />

                            <input
                                type="tel"
                                placeholder="Numara"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                            />

                            <input
                                type="email"
                                placeholder="Mail"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.9rem',
                                    background: isSubmitting ? 'rgba(255,255,255,0.5)' : '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#000',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => !isSubmitting && (e.target.style.background = 'rgba(255,255,255,0.9)')}
                                onMouseLeave={(e) => !isSubmitting && (e.target.style.background = '#fff')}
                            >
                                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                disabled={isSubmitting}
                                style={{
                                    padding: '0.6rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '0.8rem',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => !isSubmitting && (e.target.style.color = 'rgba(255,255,255,0.8)')}
                                onMouseLeave={(e) => !isSubmitting && (e.target.style.color = 'rgba(255,255,255,0.5)')}
                            >
                                İptal
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default Contact;
