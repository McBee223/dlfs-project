import HomePageNavBar from "../../components/layout/userLayout/fixedLayout/HomePageNavBar";
import LogInMainLayout from "../../components/layout/userLayout/mainLayouts/LogInMainLayout";
import AboutUsSection from "../../components/layout/userLayout/mainSections/AboutUsSection";
import FeaturesSection from "../../components/layout/userLayout/mainSections/FeaturesSection";

function Login() {
  return (
    <div>

      <HomePageNavBar />

      <section id="home">
        <LogInMainLayout />
      </section>

      <section id="about">
        <AboutUsSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

    </div>
  );
}

export default Login;





