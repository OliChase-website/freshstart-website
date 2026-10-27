import biz from '../data/business.json';

// A value counts as "set" once the placeholder brackets / X's in business.json are replaced
// with the real number or link. Unset contact methods are hidden instead of showing a
// broken button or "[Mobile number]" on the live site.
export const isSet = (v?: string | null): v is string =>
  !!v && v.trim() !== '' && !v.includes('[') && !/X{4,}/.test(v);

const digits = (v: string) => v.replace(/[^\d+]/g, '');

export const contact = {
  messenger: isSet(biz.messengerUrl) ? biz.messengerUrl : null,
  phone: isSet(biz.phone) ? biz.phone : null,
  phoneDisplay: isSet(biz.phoneDisplay) ? biz.phoneDisplay : null,
  viber: isSet(biz.viber) ? `viber://chat?number=${encodeURIComponent(digits(biz.viber))}` : null,
  email: biz.email,
  bookingForm: isSet(biz.bookingFormUrl) ? biz.bookingFormUrl : null,
  gbp: isSet(biz.gbp) ? biz.gbp : null,
};

/** Messenger link with a pre-filled message, or the booking page while Messenger is not set up. */
export function messengerLink(message?: string): string | null {
  if (!contact.messenger) return null;
  return message ? `${contact.messenger}?text=${encodeURIComponent(message)}` : contact.messenger;
}

export const sameAs = [biz.facebook, biz.instagram, biz.tiktok, biz.gbp].filter(isSet);
