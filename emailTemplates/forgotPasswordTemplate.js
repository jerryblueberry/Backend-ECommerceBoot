

const forgotPasswordTemplate  = (otp) => {
    return  `
    <mjml>
        <mj-body>
            <mj-section>
                <mj-column>
                    <mj-text>
                        <p>Password Recovery</p>
                        <p>OTP</p>
                        <p>Don't share your OTP </p>
                        <p><strong>${otp}</strong></p>
                        
                    </mj-text>
                </mj-column>
            </mj-section>
        </mj-body>
    </mjml>
    `
}

module.exports = {forgotPasswordTemplate};