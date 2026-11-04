const InitializeBabeleIntegration = () => {
  /**
   * Configure translations when the Babele module initializes.
   * https://foundryvtt.com/packages/babele
   *
   * @public
   * @memberof hookEvents
   */
  Hooks.once("babele.init", (babele) => {
    babele.setSystemTranslationsDir("babele");
  });
};

export default InitializeBabeleIntegration;
