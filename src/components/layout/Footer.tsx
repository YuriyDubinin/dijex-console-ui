import { Link } from 'react-router-dom';
import { Container } from './Container';
import { AnchorLink } from './AnchorLink';
import { landing } from '@/content/landing';

export function Footer() {
  const { footer, nav } = landing;

  return (
    <footer className="mt-24 border-t border-border bg-bg-base">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Dijex
            </div>
            <p className="mt-4 max-w-xs text-small text-text-secondary">{footer.tagline}</p>
          </div>

          <div>
            <h2 className="text-small font-semibold uppercase tracking-wider text-text-muted">
              {footer.navTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {nav.map((item) => (
                <li key={item.id}>
                  <AnchorLink
                    href={`/${item.href}`}
                    className="text-small text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-small font-semibold uppercase tracking-wider text-text-muted">
              {footer.contactsTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {footer.contacts.map((contact) => (
                <li key={contact.href}>
                  <a
                    href={contact.href}
                    className="text-small text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-small font-semibold uppercase tracking-wider text-text-muted">
              {footer.socialsTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {footer.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-small text-text-muted">{footer.copyright}</p>
          <Link
            to={footer.privacyLink.href}
            className="text-small text-text-secondary transition-colors hover:text-text-primary"
          >
            {footer.privacyLink.label}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
