// app/register/page.jsx

"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@components/NavBar";
import styles from "./register.module.css";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    profileImage: null,
    description: "",
    termsAccepted: false, // Par défaut, l'utilisateur n'a pas coché les termes
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validateStep = () => {
    const stepErrors = {};

    if (step === 1) {
      if (!formData.email) stepErrors.email = "L'adresse e-mail est obligatoire.";
      if (!formData.password) stepErrors.password = "Le mot de passe est obligatoire.";

      // Vérification de la longueur du mot de passe
      if (formData.password && formData.password.length < 12) {
        stepErrors.password = "Le mot de passe doit contenir au moins 12 caractères.";
      }

      // Vérification des exigences du mot de passe (majuscule, chiffre, caractère spécial)
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
      if (formData.password && !passwordRegex.test(formData.password)) {
        stepErrors.password = "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.";
      }

      // Vérification que les mots de passe correspondent
      if (formData.password && formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      }
    }

    if (step === 2) {
      if (!formData.username) stepErrors.username = "Le nom d'utilisateur est obligatoire.";
    }

    // Vérification de l'acceptation des termes à l'étape 3
    if (step === 3 && !formData.termsAccepted) {
      stepErrors.termsAccepted = "Vous devez accepter les termes et conditions.";
    }

    // Ajouter un message d'erreur global si un champ est manquant
    if (Object.keys(stepErrors).length === 0 && step === 1 && !formData.email) {
      stepErrors.global = "Tous les champs doivent être remplis.";
    }

    return stepErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setIsLoading(true);

    // Vérification de l'acceptation des termes avant l'envoi
    if (!formData.termsAccepted) {
      setServerError("Vous devez accepter les termes et conditions.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profileImage" && value instanceof File) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, value || "");
      }
    });

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();

      if (response.ok) {
        const loginResponse = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (!loginResponse.error) {
          router.push("/register/success");
        } else {
          setServerError("Erreur lors de la connexion. Veuillez réessayer.");
        }
      } else {
        setServerError(result.message || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (error) {
      setServerError("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.registerPage}>
        <div className={styles.registerContent}>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h1 className={styles.title}>Créez votre compte</h1>
                <div>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                  />
                  {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div>
                  <label>Mot de passe</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)} 
                  >
                    {showPassword ? "Cacher" : "Voir"}
                  </button>
                  {errors.password && <p className={styles.error}>{errors.password}</p>}
                </div>
                <div>
                  <label>Confirmation du mot de passe</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)} 
                  >
                    {showConfirmPassword ? "Cacher" : "Voir"}
                  </button>
                  {errors.confirmPassword && (
                    <p className={styles.error}>{errors.confirmPassword}</p>
                  )}
                </div>
                {errors.global && <p className={styles.error}>{errors.global}</p>}
                <button type="button" className={styles.btn} onClick={handleNextStep}>
                  Suivant
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className={styles.title}>Informations</h1>
                <div>
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-required="true"
                  />
                  {errors.username && <p className={styles.error}>{errors.username}</p>}
                </div>
                <div className={styles.navButtons}>
                  <button type="button" className={styles.btn} onClick={handlePreviousStep}>
                    Précédent
                  </button>
                  <button type="button" className={styles.btn} onClick={handleNextStep}>
                    Suivant
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className={styles.title}>Profil</h1>
                <div>
                  <label>Image de profil (optionnel)</label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Description (optionnel)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                    />
                    Accepter les termes et conditions
                  </label>
                  {errors.termsAccepted && (
                    <p className={styles.error}>{errors.termsAccepted}</p>
                  )}
                </div>
                <div className={styles.navButtons}>
                  <button type="button" className={styles.btn} onClick={handlePreviousStep}>
                    Précédent
                  </button>
                  <button type="submit" className={styles.btn} disabled={isLoading}>
                    {isLoading ? "Chargement..." : "Finaliser"}
                  </button>
                </div>
              </>
            )}
            {serverError && <p className={styles.error}>{serverError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
