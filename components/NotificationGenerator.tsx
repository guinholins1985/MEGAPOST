import React, { useState } from 'react';
import { generateNotificationImages } from '../services/geminiService';
import type { NotificationData } from '../types';

// --- Payment Logo SVG Components ---
const PixLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.012 2.502c-4.14 0-7.303 1.93-8.868 4.766l.115.068c.382.227.81.332 1.25.332 1.298 0 2.22-1.21 3.53-1.21.93 0 1.543.536 1.543 1.233 0 .977-1.48 1.48-2.52 1.834-1.78.6-3.456 1.43-3.456 3.6 0 1.953 1.553 2.87 2.915 2.87 1.03 0 1.85-.36 2.45-.85l.135.08c1.55 1.02 3.34 1.58 5.14 1.58 4.14 0 7.303-1.93 8.868-4.766l-.115-.068c-.382-.227-.81-.332-1.25-.332-1.298 0-2.22 1.21-3.53 1.21-.93 0-1.543-.536-1.543-1.233 0-.977 1.48-1.48 2.52-1.834 1.78-.6 3.456-1.43 3.456-3.6 0-1.953-1.553-2.87-2.915-2.87-1.03 0-1.85.36-2.45.85l-.135-.08c-1.55-1.02-3.34-1.58-5.14-1.58Z" fill="#32BCAD"/></svg>);
const VisaLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1A1F71" d="M14.2.6H9.8L6.2 16.1l4.4.9L12.5 3l1.7 13.9 4.2-.9L14.2.6z"/><path fill="#F7A600" d="M23.1 16.1l-1.1-6.1c0-.2-.2-.4-.4-.4H17l-1.3 7.8c-.1.4.3.8.7.8.2 0 .4-.1.5-.3l1.8-6.1h3l-2.2 7.5c-.1.4.3.8.7.8h.6c.4 0 .7-.3.8-.7l.9-2.9.2-.5z"/><path fill="#1A1F71" d="M6.2 16.1L4 4.5c-.1-.4-.5-.6-.9-.5l-3 .6C0 4.7 0 4.9 0 5.1l2.8 11.7c.1.4.5.6.9.5l2.4-.5c.1 0 .2-.1.1-.3z"/></svg>);
const MastercardLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="8.5" cy="12" r="6.5" fill="#EA001B"/><circle cx="15.5" cy="12" r="6.5" fill="#F79F1A"/><path fill="#FF5F00" d="M12 18.5a6.5 6.5 0 0 0 3.5-12.15A6.5 6.5 0 0 0 8.5 12a6.5 6.5 0 0 0 3.5 6.5z"/></svg>);
const EloLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="6" cy="12" r="4" fill="#FDB913"/><path fill="#0072BC" d="M15 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z"/><path fill="#E31B23" d="M12 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0z"/></svg>);
const BoletoLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2 5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5zm1 6h2v4H3v-4zm4 0h2v4H7v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zM2 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z" fill="#000"/></svg>);
const PicPayLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.33 13.82c-.9.9-2.05 1.54-3.4 1.54-2.2 0-3.83-1.63-3.83-3.83s1.63-3.83 3.83-3.83c1.35 0 2.5.64 3.4 1.54l1.02-1.02c-1.2-1.2-2.77-1.92-4.42-1.92-3.23 0-5.85 2.62-5.85 5.85s2.62 5.85 5.85 5.85c1.65 0 3.22-.72 4.42-1.92l-1.02-1.02zm5.48-2.67c-1.12-1.12-2.58-1.9-4.15-1.9-1.57 0-3.03.78-4.15 1.9l-1.02-1.02c1.42-1.42 3.2-2.28 5.17-2.28s3.75.86 5.17 2.28l-1.02 1.02z" fill="#21C25E"/></svg>);
const KiwifyLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.23 13.88H8.25v-7.76h2.52v7.76zm6.3-4.15l-3-3.63h2.6l1.8 2.2 1.8-2.2h2.6l-3 3.63 3.1 4.13h-2.7l-1.9-2.3-1.9 2.3h-2.7l3.1-4.13z" fill="#7D40E7"/></svg>);
const InterLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM17.5 17.5H6.5V6.5h11v11zM16 8h-3v8h-2V8H8v8h8V8z" fill="#FF7A00"/></svg>);
const HotmartLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6 3.32c-.98-.62-2.07-.98-3.23-.98-2.12 0-4.08.83-5.52 2.28-.9.9-1.57 2.02-1.88 3.24-.02.08-.03.17-.03.25.01 1.48.59 2.87 1.57 3.92.54.58 1.18 1.05 1.88 1.42l4.1-4.1V3.32zM17.6 8.5c-.32-1.22-.98-2.34-1.88-3.24l-6.02 6.02c.37.7.84 1.34 1.42 1.88 1.05 1 2.44 1.56 3.92 1.57 1.48.01 2.87-.58 3.92-1.57.99-.99 1.55-2.38 1.56-3.86 0-1.16-.36-2.25-.98-3.23-.3-.46-.66-.88-1.06-1.25l-4.02 4.02.16.16z" fill="#F04E23"/></svg>);
const BancoDoBrasilLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" fill="#00358E"/><path d="M14.33 7.828H9.67v2.336h4.66V7.828zM9.67 13.836h4.66V11.5h-4.66v2.336zM15.5 5.5H8.5v2.328h7V5.5zm0 8.336H8.5V11.5h7v2.336zm0 2.336H8.5V18.5h7v-2.328z" fill="#FEDA00"/></svg>);
const ShopeeLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 12.33c-.16 0-.3.1-.37.24l-.6 1.52c-.08.2-.3.33-.52.33H9.6c-.22 0-.44-.13-.52-.33l-.6-1.52c-.07-.14-.2-.24-.37-.24H5.5v-1h2.6c.22 0 .44.13.52.33l.6 1.52c.07.14.2.24.37.24h3.82c.17 0 .3-.1.37-.24l.6-1.52c.08-.2.3-.33.52-.33h2.6v1h-2.61zM16.5 7h-9c-.28 0-.5.22-.5.5v4c0 .28.22.5.5.5h9c.28 0 .5-.22.5-.5v-4c0-.28-.22-.5-.5-.5zm-4.25 3.25h-2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.5c.28 0 .5.22.5.5s-.22.5-.5.5z" fill="#EE4D2D"/></svg>);
const MercadoLivreLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" fill="#FFE600"/><path d="M16.59 13.41L13 16V8l3.59 2.59c.53.38.53 1.24 0 1.62zm-9.18-1.62L11 8v8L7.41 13.41c-.53-.38-.53-1.24 0-1.62z" fill="#000"/></svg>);
const NubankLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.39 13.5H14.5l-3.37-6.28V15.5h-1.8V8.5h1.9l3.37 6.27V8.5h1.8v7z" fill="#820AD1"/></svg>);
const SpriteLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#009444"/><path d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" fill="#FEF300"/><path d="M12 16.25a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5z" fill="#00A9E0"/></svg>);
const MercadoPagoLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" fill="#00AEEF"/><path d="M11.63 15.11V8.89l-2.47 2.47c-.4.4-.4 1.05 0 1.45l2.47 2.3zm.74-7.67L18.5 12l-6.13 4.56V7.44z" fill="#fff"/></svg>);
const PayPalLogo: React.FC<{className?: string}> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#003087"/><path d="M13.2 6h-4.4c-.66 0-1.2.54-1.2 1.2v9.6c0 .66.54 1.2 1.2 1.2h2.8c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.4 9h-1.6c-.22 0-.4-.18-.4-.4V9.4c0-.22.18-.4.4-.4h.6c1.99 0 3.6 1.61 3.6 3.6s-1.61 3.4-3.6 3.4z" fill="#009CDE"/><path d="M10.4 9h-1c-.22 0-.4-.18-.4-.4V7c0-.22.18-.4.4-.4h2.4c1.99 0 3.6 1.61 3.6 3.6 0-1.99-1.61-3.6-3.6-3.6h-1.4v2.4z" fill="#005EA6"/></svg>);

const paymentMethods = [
    { name: 'Pix', text: 'Pix', Svg: PixLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.012 2.502c-4.14 0-7.303 1.93-8.868 4.766l.115.068c.382.227.81.332 1.25.332 1.298 0 2.22-1.21 3.53-1.21.93 0 1.543.536 1.543 1.233 0 .977-1.48 1.48-2.52 1.834-1.78.6-3.456 1.43-3.456 3.6 0 1.953 1.553 2.87 2.915 2.87 1.03 0 1.85-.36 2.45-.85l.135.08c1.55 1.02 3.34 1.58 5.14 1.58 4.14 0 7.303-1.93 8.868-4.766l-.115-.068c-.382-.227-.81-.332-1.25-.332-1.298 0-2.22 1.21-3.53 1.21-.93 0-1.543-.536-1.543-1.233 0-.977 1.48-1.48 2.52-1.834 1.78-.6 3.456-1.43 3.456-3.6 0-1.953-1.553-2.87-2.915-2.87-1.03 0-1.85.36-2.45.85l-.135-.08c-1.55-1.02-3.34-1.58-5.14-1.58Z" fill="#32BCAD"/></svg>'},
    { name: 'PicPay', text: 'PicPay', Svg: PicPayLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.33 13.82c-.9.9-2.05 1.54-3.4 1.54-2.2 0-3.83-1.63-3.83-3.83s1.63-3.83 3.83-3.83c1.35 0 2.5.64 3.4 1.54l1.02-1.02c-1.2-1.2-2.77-1.92-4.42-1.92-3.23 0-5.85 2.62-5.85 5.85s2.62 5.85 5.85 5.85c1.65 0 3.22-.72 4.42-1.92l-1.02-1.02zm5.48-2.67c-1.12-1.12-2.58-1.9-4.15-1.9-1.57 0-3.03.78-4.15 1.9l-1.02-1.02c1.42-1.42 3.2-2.28 5.17-2.28s3.75.86 5.17 2.28l-1.02 1.02z" fill="#21C25E"/></svg>'},
    { name: 'MercadoPago', text: 'Mercado Pago', Svg: MercadoPagoLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" fill="#00AEEF"/><path d="M11.63 15.11V8.89l-2.47 2.47c-.4.4-.4 1.05 0 1.45l2.47 2.3zm.74-7.67L18.5 12l-6.13 4.56V7.44z" fill="#fff"/></svg>'},
    { name: 'PayPal', text: 'PayPal', Svg: PayPalLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#003087"/><path d="M13.2 6h-4.4c-.66 0-1.2.54-1.2 1.2v9.6c0 .66.54 1.2 1.2 1.2h2.8c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.4 9h-1.6c-.22 0-.4-.18-.4-.4V9.4c0-.22.18-.4.4-.4h.6c1.99 0 3.6 1.61 3.6 3.6s-1.61 3.4-3.6 3.4z" fill="#009CDE"/><path d="M10.4 9h-1c-.22 0-.4-.18-.4-.4V7c0-.22.18-.4.4-.4h2.4c1.99 0 3.6 1.61 3.6 3.6 0-1.99-1.61-3.6-3.6-3.6h-1.4v2.4z" fill="#005EA6"/></svg>'},
    { name: 'Visa', text: 'Cartão de Crédito', Svg: VisaLogo, svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1A1F71" d="M14.2.6H9.8L6.2 16.1l4.4.9L12.5 3l1.7 13.9 4.2-.9L14.2.6z"/><path fill="#F7A600" d="M23.1 16.1l-1.1-6.1c0-.2-.2-.4-.4-.4H17l-1.3 7.8c-.1.4.3.8.7.8.2 0 .4-.1.5-.3l1.8-6.1h3l-2.2 7.5c-.1.4.3.8.7.8h.6c.4 0 .7-.3.8-.7l.9-2.9.2-.5z"/><path fill="#1A1F71" d="M6.2 16.1L4 4.5c-.1-.4-.5-.6-.9-.5l-3 .6C0 4.7 0 4.9 0 5.1l2.8 11.7c.1.4.5.6.9.5l2.4-.5c.1 0 .2-.1.1-.3z"/></svg>'},
    { name: 'Mastercard', text: 'Cartão de Crédito', Svg: MastercardLogo, svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="8.5" cy="12" r="6.5" fill="#EA001B"/><circle cx="15.5" cy="12" r="6.5" fill="#F79F1A"/><path fill="#FF5F00" d="M12 18.5a6.5 6.5 0 0 0 3.5-12.15A6.5 6.5 0 0 0 8.5 12a6.5 6.5 0 0 0 3.5 6.5z"/></svg>'},
    { name: 'Elo', text: 'Cartão de Crédito', Svg: EloLogo, svgString: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="6" cy="12" r="4" fill="#FDB913"/><path fill="#0072BC" d="M15 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z"/><path fill="#E31B23" d="M12 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0z"/></svg>'},
    { name: 'Boleto', text: 'Boleto', Svg: BoletoLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5zm1 6h2v4H3v-4zm4 0h2v4H7v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4zM2 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z" fill="#000"/></svg>'},
    { name: 'Kiwify', text: 'Kiwify', Svg: KiwifyLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.23 13.88H8.25v-7.76h2.52v7.76zm6.3-4.15l-3-3.63h2.6l1.8 2.2 1.8-2.2h2.6l-3 3.63 3.1 4.13h-2.7l-1.9-2.3-1.9 2.3h-2.7l3.1-4.13z" fill="#7D40E7"/></svg>'},
    { name: 'Hotmart', text: 'Hotmart', Svg: HotmartLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6 3.32c-.98-.62-2.07-.98-3.23-.98-2.12 0-4.08.83-5.52 2.28-.9.9-1.57 2.02-1.88 3.24-.02.08-.03.17-.03.25.01 1.48.59 2.87 1.57 3.92.54.58 1.18 1.05 1.88 1.42l4.1-4.1V3.32zM17.6 8.5c-.32-1.22-.98-2.34-1.88-3.24l-6.02 6.02c.37.7.84 1.34 1.42 1.88 1.05 1 2.44 1.56 3.92 1.57 1.48.01 2.87-.58 3.92-1.57.99-.99 1.55-2.38 1.56-3.86 0-1.16-.36-2.25-.98-3.23-.3-.46-.66-.88-1.06-1.25l-4.02 4.02.16.16z" fill="#F04E23"/></svg>'},
    { name: 'Shopee', text: 'Shopee', Svg: ShopeeLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 12.33c-.16 0-.3.1-.37.24l-.6 1.52c-.08.2-.3.33-.52.33H9.6c-.22 0-.44-.13-.52-.33l-.6-1.52c-.07-.14-.2-.24-.37-.24H5.5v-1h2.6c.22 0 .44.13.52.33l.6 1.52c.07.14.2.24.37.24h3.82c.17 0 .3-.1.37-.24l.6-1.52c.08-.2.3-.33.52-.33h2.6v1h-2.61zM16.5 7h-9c-.28 0-.5.22-.5.5v4c0 .28.22.5.5.5h9c.28 0 .5-.22.5-.5v-4c0-.28-.22-.5-.5-.5zm-4.25 3.25h-2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.5c.28 0 .5.22.5.5s-.22.5-.5.5z" fill="#EE4D2D"/></svg>'},
    { name: 'MercadoLivre', text: 'Mercado Livre', Svg: MercadoLivreLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z" fill="#FFE600"/><path d="M16.59 13.41L13 16V8l3.59 2.59c.53.38.53 1.24 0 1.62zm-9.18-1.62L11 8v8L7.41 13.41c-.53-.38-.53-1.24 0-1.62z" fill="#000"/></svg>'},
    { name: 'Inter', text: 'Banco Inter', Svg: InterLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM17.5 17.5H6.5V6.5h11v11zM16 8h-3v8h-2V8H8v8h8V8z" fill="#FF7A00"/></svg>'},
    { name: 'Nubank', text: 'Nubank', Svg: NubankLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.39 13.5H14.5l-3.37-6.28V15.5h-1.8V8.5h1.9l3.37 6.27V8.5h1.8v7z" fill="#820AD1"/></svg>'},
    { name: 'BancoDoBrasil', text: 'Banco do Brasil', Svg: BancoDoBrasilLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" fill="#00358E"/><path d="M14.33 7.828H9.67v2.336h4.66V7.828zM9.67 13.836h4.66V11.5h-4.66v2.336zM15.5 5.5H8.5v2.328h7V5.5zm0 8.336H8.5V11.5h7v2.336zm0 2.336H8.5V18.5h7v-2.328z" fill="#FEDA00"/></svg>'},
    { name: 'Sprite', text: 'Sprite', Svg: SpriteLogo, svgString: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#009444"/><path d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" fill="#FEF300"/><path d="M12 16.25a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5z" fill="#00A9E0"/></svg>'},
];

const Loader: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full p-4">
        <div className="w-8 h-8 border-2 border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const NotificationGenerator: React.FC = () => {
    const [formData, setFormData] = useState<Omit<NotificationData, 'paymentLogoSvg'>>({
        eventType: 'Venda Aprovada',
        value: '37,98',
        product: 'Produto Exemplo',
        time: 'agora',
        client: 'Cliente Fictício',
        paymentMethod: 'Pix',
    });
    const [selectedLogo, setSelectedLogo] = useState(paymentMethods[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedNotifications, setGeneratedNotifications] = useState<(string | null)[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoSelect = (method: typeof paymentMethods[0]) => {
        setSelectedLogo(method);
        setFormData(prev => ({ ...prev, paymentMethod: method.text }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedNotifications(Array(5).fill('loading'));

        try {
            const fullData: NotificationData = {
                ...formData,
                paymentLogoSvg: selectedLogo.svgString,
            };
            const images = await generateNotificationImages(fullData);
            setGeneratedNotifications(images);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Ocorreu um erro desconhecido.');
            setGeneratedNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] p-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Evento</label>
                        <select id="eventType" name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300">
                            <option>Venda Aprovada</option>
                            <option>Pix Gerado</option>
                            <option>Pedido Enviado</option>
                            <option>Venda Cancelada</option>
                            <option>Pix Expirado</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor (R$)</label>
                        <input type="text" id="value" name="value" value={formData.value} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300" placeholder="Ex: 99,90" />
                    </div>
                    <div>
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Produto</label>
                        <input type="text" id="product" name="product" value={formData.product} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300" />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</label>
                        <input type="text" id="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300" placeholder="agora" />
                    </div>
                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Cliente</label>
                        <input type="text" id="client" name="client" value={formData.client} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300" />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo / Método de Pagamento</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                        {paymentMethods.map(method => (
                            <button key={method.name} type="button" onClick={() => handleLogoSelect(method)} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${selectedLogo.name === method.name ? 'border-[var(--primary-accent)] bg-indigo-50 dark:bg-indigo-900/20' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <method.Svg className="h-8 w-8 object-contain" />
                                <span className="text-xs mt-1 text-center leading-tight">{method.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <button type="submit" disabled={isLoading} className="w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105">
                        {isLoading ? 'Gerando Imagens...' : 'Gerar 5 Designs de Notificação'}
                    </button>
                </div>
            </form>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {generatedNotifications.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-center mb-4">Designs Gerados</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedNotifications.map((asset, index) => (
                            <div key={`notification-${index}`} className="aspect-[9/19] rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105 group">
                                {asset === 'loading' ? <Loader /> : asset ? (
                                    <a href={`data:image/png;base64,${asset}`} download={`notificacao_${formData.eventType.replace(' ','_')}_${index + 1}.png`} className="block w-full h-full relative">
                                        <img src={`data:image/png;base64,${asset}`} alt={`Notificação gerada ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">Download</div>
                                    </a>
                                ) : <div className="w-full h-full flex items-center justify-center text-xs text-red-500 p-2 text-center">Falha ao gerar</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationGenerator;
