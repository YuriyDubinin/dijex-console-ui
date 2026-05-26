import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { feedbackSchema, type FeedbackInput } from '@/schemas/feedback';
import { submitFeedback, ApiError } from '@/lib/api';
import { landing } from '@/content/landing';

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6 rounded-2xl border border-success/30 bg-bg-surface/60 px-8 py-12 text-center backdrop-blur-sm"
    >
      <CheckCircle size={48} className="text-success" aria-hidden />
      <div>
        <h3 className="font-display text-h3 font-semibold text-text-primary">
          {landing.contact.successTitle}
        </h3>
        <p className="mt-2 text-body text-text-secondary">{landing.contact.successBody}</p>
      </div>
      <Button variant="ghost" onClick={onReset}>
        {landing.contact.resetLabel}
      </Button>
    </motion.div>
  );
}

export function ContactForm() {
  const { show: showToast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = async (data: FeedbackInput) => {
    if (honeypotRef.current?.value) {
      setShowSuccess(true);
      return;
    }

    try {
      await submitFeedback(data);
      setShowSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.payload?.details) {
        err.payload.details.forEach((d) => {
          setError(d.field as keyof FeedbackInput, { message: d.message });
        });
        return;
      }
      showToast(landing.contact.errorToast, 'error');
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    reset();
  };

  const { contact } = landing;

  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <FadeIn className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-primary">
              Связаться
            </p>
            <h2 className="mt-3 font-display text-h1 font-bold text-text-primary">
              {contact.title}
            </h2>
            <p className="mt-4 text-body text-text-secondary">{contact.lead}</p>
          </div>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <SuccessCard key="success" onReset={handleReset} />
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="flex flex-col gap-5 rounded-2xl border border-border bg-bg-surface/40 p-6 backdrop-blur-sm sm:p-8"
                >
                  {/* Honeypot — hidden from humans */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    style={{ display: 'none' }}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Имя"
                      htmlFor="name"
                      error={errors.name?.message}
                      required
                    >
                      <Input
                        id="name"
                        type="text"
                        placeholder="Иван Иванов"
                        hasError={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        autoComplete="name"
                        {...register('name')}
                      />
                    </Field>

                    <Field
                      label="Email"
                      htmlFor="email"
                      error={errors.email?.message}
                      required
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="ivan@example.com"
                        hasError={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        autoComplete="email"
                        {...register('email')}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Телефон" htmlFor="phone" error={errors.phone?.message}>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 000-00-00"
                        hasError={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        autoComplete="tel"
                        {...register('phone')}
                      />
                    </Field>

                    <Field label="Тема" htmlFor="subject" error={errors.subject?.message}>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Разработка веб-приложения"
                        hasError={!!errors.subject}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        {...register('subject')}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Сообщение"
                    htmlFor="message"
                    error={errors.message?.message}
                    required
                  >
                    <Textarea
                      id="message"
                      placeholder="Расскажите о вашем проекте, задаче или вопросе..."
                      hasError={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      {...register('message')}
                    />
                  </Field>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={!isValid || isSubmitting}
                      aria-disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" aria-hidden />
                          {contact.submittingLabel}
                        </>
                      ) : (
                        contact.submitLabel
                      )}
                    </Button>

                    <p className="text-center text-small text-text-muted">
                      {contact.privacyNotice}{' '}
                      <Link
                        to="/privacy"
                        className="text-text-secondary underline underline-offset-2 hover:text-text-primary transition-colors"
                      >
                        Политика конфиденциальности
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </Container>
    </section>
  );
}
