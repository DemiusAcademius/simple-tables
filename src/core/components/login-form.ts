import { html, css, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { TextFieldChangeEvent } from '@vaadin/text-field'
import { AUTHENTICATION } from '@core/services/authentication'
import { debouncer } from '@core/utils/timers'

type LoginProcess =
    { status: 'show-form' } |
    { status: 'process' } |
    { status: 'error', message: string }

const styles = css`
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    `

const PERSONNEL_NUMBER_PATTERN = "^[0-9]+$"
const PW_PATTERN = "(?=.*[a-z])(?=.*[A-Z]).{8,}"
const PW_REGEXP = new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
const PERSONNEL_NUMBER_REGEXP = new RegExp(/^[0-9]+$/)

@customElement('demius-login-form')
export class LoginForm extends LitElement {
    private loginErrorDebouncer = debouncer()

    static styles = styles

    @state()
    private model = { username: '', password: '' }

    @state()
    private passwordInvalid = false

    @state()
    private disabled = true

    @state()
    private loginProcess: LoginProcess = { status: 'show-form' }

    private login = async () => {
        this.loginProcess = { status: 'process' }
        await AUTHENTICATION.testServerless(this.model)

        this.loginErrorDebouncer.clear()
        this.loginProcess = { status: 'show-form' }

        /*
        if (result.authenticated) {
            this.loginErrorDebouncer.clear()
        } else {
            this.loginProcess = { status: 'error', message: result.message }
            this.loginErrorDebouncer.delayed(() => {
                this.loginProcess = { status: 'show-form' }
            }, result.takesLongWait ? 10000 : 5000)
        }
        */
    }

    private onPasswordChanged = (e: TextFieldChangeEvent): void => {
        this.model.password = e.target.value
        this.passwordInvalid = this.model.password.length > 0 && !PW_REGEXP.test(this.model.password)
        this.recalcDisabled()
    }

    private recalcDisabled = () => {
        this.disabled = this.model.username.length == 0 || !PERSONNEL_NUMBER_REGEXP.test(this.model.username) || this.model.password.length == 0 || this.passwordInvalid
    }

    render() {
        return html`
        <form style="width: 100%" autocomplete="off">
            <fieldset
                ?disabled=${this.loginProcess.status !== 'show-form'}
                style="border: none; padding: 0"
            >
                <input autocomplete="off" name="hidden" type="text" style="display:none;">

                <vaadin-text-field
                    name="username"
                    label="num??r de personal"
                    helper-text="lungimea minimala 4 cifre; Trebuie sa fie un Numar"
                    required
                    autofocus
                    minlength="4"
                    pattern=${PERSONNEL_NUMBER_PATTERN}
                    .value=${this.model.username}
                    @value-changed=${(e: TextFieldChangeEvent) => { this.model.username = e.target.value; this.recalcDisabled() }}
                    style="width: 100%"
                    autocomplete="off"
                ></vaadin-text-field>
                <vaadin-password-field
                    name="password"
                    label="parola"
                    helper-text="Trebuie s?? aib?? cel pu??in 8 caractere ??i un caracter special"
                    required
                    minlength="8"
                    pattern=${PW_PATTERN}
                    .value=${this.model.password}
                    @value-changed=${this.onPasswordChanged}
                    style="width: 100%"
                    autocomplete="new-password"
                ></vaadin-password-field>
            </fieldset>
            <vaadin-button
                theme="primary"
                @click=${this.login}
                ?disabled=${this.disabled}
                style="width: 100%; margin-top: 1em"
            >LOGIN</vaadin-button>

            <div style="width: 100%; margin-top: 1em">
                E??ti aici pentru prima dat???
            </div>

            <vaadin-button
                theme="primary"
                style="width: 100%; margin-top: 1em"
            >REGISTER</vaadin-button>
        </form>
        `
    }

    renderActionBlock() {
        return this.loginProcess.status === 'error' ?
            html`
                <div class="error-message">
                    ${this.loginProcess.message}
                </div>
            ` :
            html`
            <vaadin-button
                theme="primary"
                @click=${this.login}
                ?disabled=${this.disabled}
                style="width: 100%; margin-top: 1em"
            > ${this.loginProcess.status === 'show-form' ? 'LOGIN' : 'PRELUCREAREA DATELOR...'} </vaadin-button>

            <div style="width: 100%; margin-top: 1em">
                E??ti aici pentru prima dat???
            </div>

            <vaadin-button
                theme="primary"
                style="width: 100%; margin-top: 1em"
            >REGISTER</vaadin-button>
        `
    }

}
