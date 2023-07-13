const MasscanIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    computed: {
        body_data() {
            const {
                config,
                is_default,
                selected_integration: id,
                include_ports,
                exclude_ports,
                save_intermediates_to,
            } = this
            return {
                config,
                is_default,
                id,
                include_ports,
                exclude_ports,
                save_intermediates_to,
            }
        },
        scan_types_indeterminate() {
            return !(this.scan_types.length === 0 || this.scan_types.length === this.available_scan_types.length)
        }
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data.settings, false)
        }
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },

        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('AEM item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                alertCreateTest.add(e, 'danger-overlay')
            }
        },


        handle_select_all(e) {
            if (this.scan_types_indeterminate || !e.target.checked) {
                this.scan_types = []
                e.target.checked = false
            } else {
                this.scan_types = [...this.available_scan_types]
            }
        },
        handleScanTypeCheck(value, checked) {
            if (checked) {
                this.scan_types.push(value)
            } else {
                const i = this.scan_types.indexOf(value)
                this.scan_types.splice(i, 1)
            }
        },

        initialState: () => ({
            // toggle: false,
            config: {},
            error: {},

            include_ports: "0-65535",
            exclude_ports: "",
            save_intermediates_to: '/data/intermediates/dast',
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>

            <div class="form-group">
                <div class="form-group form-row">
                    <div class="col-6">
                        <h9>Include ports</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="text" class="form-control form-control-alternative"
                            placeholder="0-65535"
                            v-model="include_ports"
                            :class="{ 'is-invalid': error.include_ports }">
                        <div class="invalid-feedback">[[ error.include_ports ]]</div>
                    </div>
                    <div class="col-6">

                        <h9>Exclude ports</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="text" class="form-control form-control-alternative"
                            placeholder="1,4-40,4444"
                            v-model="exclude_ports"
                            :class="{ 'is-invalid': error.exclude_ports }">
                        <div class="invalid-feedback">[[ error.exclude_ports ]]</div>
                    </div>
                </div>
                
                <h9>Save intermediates to</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                    placeholder=""
                    v-model="save_intermediates_to"
                    :class="{ 'is-invalid': error.save_intermediates_to }">
                <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>
            </div>
        </div>
    `
}


register_component('scanner-masscan', MasscanIntegration)

