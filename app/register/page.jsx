// appp/register/page.jsx

'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    description: "",
    profileImage: null,
    challenges: [],
    sharedPosts: [],
    status: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateStep = () => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.email) stepErrors.email = "L'adresse e-mail est obligatoire.";
      if (!formData.password) stepErrors.password = "Le mot de passe est obligatoire.";
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      }
    } else if (step === 2) {
      if (!formData.username) stepErrors.username = "Le nom d'utilisateur est obligatoire.";
      else if (formData.username.length < 3) {
        stepErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
      }
      if (!formData.status) stepErrors.status = "Le statut est obligatoire.";
    }
    
    return stepErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSend.append(key, value);
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
          console.error("Erreur lors de la connexion :", loginResponse.error);
        }
      } else {
        console.error(result.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur inattendue :", error);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h1 className="gradient-color">Créez votre compte</h1>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div>
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <div>
                <label>Confirmation du mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="error">{errors.confirmPassword}</p>
                )}
              </div>
              <button type="button" onClick={handleNextStep}>
                Suivant
              </button>
            </>
          )}
  {step === 2 && (
              <>
                <h1 className="gradient-color">Informations</h1>
                <div>
                  <label>Statut</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="">Sélectionnez</option>
                    <option value="participant">Paticipant</option>
                    <option value="visiteur">Visiteur</option>
                  </select>
                  {errors.status && <p className="error">{errors.status}</p>}
                </div>
                <div>
                  <label>Nom d'utilisateur</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} />
                  {errors.username && <p className="error">{errors.username}</p>}
                </div>
                {(formData.status === "visiteur" || formData.status === "participants")}
                <button type="button" onClick={handleNextStep}>Suivant</button>
              </>
            )}
          {step === 3 && (
            <>
              <h1 className="gradient-color">Profil</h1>
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
              <button type="submit">Finaliser</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
