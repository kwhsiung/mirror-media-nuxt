<template>
  <div class="login-form">
    <div class="login-form__federated-login federated-login">
      <ContainerMembershipLoginWithFacebookNew
        :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
        class="federated-login__facebook"
      />
      <ContainerMembershipLoginWithGoogleNew
        :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
        class="federated-login__google"
      />
    </div>
    <div class="login-form__separator separator">
      <span>或</span>
    </div>
    <div class="login-form__email-login email-login">
      <UiMembershipInputEmailInvalidation
        class="email-login__email-input"
        :shouldShowInvalidHint="isSubmitButtonClicked"
        @input="handleInput"
        @inputValidStateChange="handleInputValidStateChange"
      />
      <div class="email-login__submit-button-wrapper">
        <UiMembershipButtonPrimary
          :disabled="!isEmailInputValid"
          @click.native="handleSubmit"
        >
          <UiMembershipLoadingIcon v-if="isLoading" />
          <p v-else>下一步</p>
        </UiMembershipButtonPrimary>
      </div>
    </div>
    <UiMembershipRightsCaveat class="login-form__rights-caveat" />
  </div>
</template>

<script>
import ContainerMembershipLoginWithFacebookNew from './ContainerMembershipLoginWithFacebookNew.vue'
import ContainerMembershipLoginWithGoogleNew from './ContainerMembershipLoginWithGoogleNew.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import UiMembershipInputEmailInvalidation from './UiMembershipInputEmailInvalidation.vue'
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipRightsCaveat from './UiMembershipRightsCaveat.vue'

export default {
  components: {
    ContainerMembershipLoginWithFacebookNew,
    ContainerMembershipLoginWithGoogleNew,
    UiMembershipLoadingIcon,
    UiMembershipInputEmailInvalidation,
    UiMembershipButtonPrimary,
    UiMembershipRightsCaveat,
  },
  props: {
    isFederatedRedirectResultLoading: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isEmailInputValid: false,
      isSubmitButtonClicked: false,
      isLoading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.isSubmitButtonClicked = true

      this.isLoading = true
      try {
        const responseArray = await this.$fire.auth.fetchSignInMethodsForEmail(
          this.email
        )

        const isEmailExistWithEmailLinkSignInMethod =
          responseArray?.[0] === 'emailLink'
        const isEmailExistWithEmailPasswordSignInMethod =
          responseArray?.[0] === 'password'
        if (isEmailExistWithEmailLinkSignInMethod) {
          this.$emit('verifyEmailSignInMethod', 'emailLink')
        } else if (isEmailExistWithEmailPasswordSignInMethod) {
          this.$emit('verifyEmailSignInMethod', 'password')
        } else {
          this.$emit('goToRegister')
        }
      } catch (e) {
        console.error(e)
      }
      this.isLoading = false
    },
    handleInput(value) {
      this.$emit('update:email', value)
    },
    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  @include media-breakpoint-up(md) {
    max-width: 423px;
    margin: 0 auto;
    padding: 32px 48px 24px;
  }

  &__separator {
    margin: 16px 0 0 0;
  }
  &__email-login {
    margin: 16px 0 0 0;
  }
  &__rights-caveat {
    margin: 24px 0 0 0;
  }
}

.federated-login {
  &__google {
    margin: 12px 0 0 0;
  }
}

.separator {
  font-size: 13px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  span {
    margin: 0 12px;
  }
  &:before,
  &:after {
    content: '';
    display: inline-block;
    flex: 1 1 auto;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.email-login {
  &__submit-button-wrapper {
    margin: 24px 0 0 0;
  }
}
</style>
