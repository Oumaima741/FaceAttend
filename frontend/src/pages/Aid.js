import React, { useState } from 'react';
import './Aid.css';

const Aid = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [faqAnswers, setFaqAnswers] = useState({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = form;

    if (name === '' || email === '' || message === '') {
      alert('Tous les champs sont obligatoires!');
      return;
    }

    alert('Votre demande a été envoyée avec succès!');
    setForm({ name: '', email: '', message: '' });
  };

  const toggleFaq = (question) => {
    setFaqAnswers({
      ...faqAnswers,
      [question]: !faqAnswers[question],
    });
  };

  return (
    <div className="aid-container">
      <div className="help-section">
        <h2>Assistance & Support</h2>
        <p>Bienvenue dans notre centre d’assistance. Vous pouvez nous contacter pour toute question, ou consulter nos réponses aux questions fréquemment posées (FAQ).</p>
        <h3>Contactez notre équipe de support</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Votre nom complet"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Décrivez votre problème ou question"
            value={form.message}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Envoyer votre demande</button>
        </form>
      </div>

      <div className="faq-section">
        <h3>Questions Fréquentes (FAQ)</h3>
        <div className="faq-item">
          <h4 onClick={() => toggleFaq('q1')}>1. Comment puis-je obtenir de l'aide ?</h4>
          {faqAnswers.q1 && (
            <p>
              Si vous avez des questions ou des problèmes, vous pouvez nous contacter via le formulaire ci-dessus, ou envoyer un email à <a href="mailto:support@exemple.com">support@exemple.com</a>. Notre équipe est là pour vous aider.
            </p>
          )}
        </div>
        <div className="faq-item">
          <h4 onClick={() => toggleFaq('q2')}>2. Quel est le délai de traitement des demandes d'assistance ?</h4>
          {faqAnswers.q2 && (
            <p>
              Notre équipe répond généralement dans un délai de 24 à 48 heures. Les demandes urgentes seront priorisées.
            </p>
          )}
        </div>
        <div className="faq-item">
          <h4 onClick={() => toggleFaq('q3')}>3. Puis-je suivre l'état de ma demande ?</h4>
          {faqAnswers.q3 && (
            <p>
              Oui, une fois votre demande soumise, vous recevrez un numéro de suivi. Vous pourrez suivre l'état de votre demande via le lien que nous vous enverrons par email.
            </p>
          )}
        </div>
        <div className="faq-item">
          <h4 onClick={() => toggleFaq('q4')}>4. Que faire si mon problème n'est pas résolu ?</h4>
          {faqAnswers.q4 && (
            <p>
              Si votre problème persiste, n’hésitez pas à nous recontacter en expliquant les étapes que vous avez suivies. Nous travaillerons avec vous pour résoudre la situation dans les plus brefs délais.
            </p>
          )}
        </div>
        <div className="faq-item">
          <h4 onClick={() => toggleFaq('q5')}>5. Existe-t-il un support 24/7 ?</h4>
          {faqAnswers.q5 && (
            <p>
              Nous offrons un support 24/7 via notre portail d’assistance en ligne. Vous pouvez également nous envoyer un message en dehors des heures de bureau, et nous vous répondrons dès que possible.
            </p>
          )}
        </div>
      </div>

      <div className="contact-info">
        <h3>Informations de Contact</h3>
        <p>
          Vous pouvez nous contacter par téléphone au <strong>(+33) 123 456 789</strong> ou par email à <a href="mailto:support@exemple.com">support@exemple.com</a>.
        </p>
        <p>
          Notre support est disponible de 9h à 18h du lundi au vendredi.
        </p>
      </div>
    </div>
  );
};

export default Aid;
