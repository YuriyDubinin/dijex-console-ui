import { Container } from '@/components/layout/Container';

export function PrivacyPage() {
  return (
    <Container className="py-24 md:py-32">
      <h1 className="font-display text-h1 font-bold text-text-primary">
        Политика конфиденциальности
      </h1>
      <div className="mt-6 max-w-3xl space-y-4 text-body text-text-secondary">
        <p>
          Этот раздел будет наполнен юридическим текстом политики конфиденциальности и согласия
          на обработку персональных данных. Сейчас — заглушка.
        </p>
        <p>
          Отправляя форму обратной связи, пользователь соглашается с обработкой указанных данных
          для целей коммуникации по проекту.
        </p>
      </div>
    </Container>
  );
}
