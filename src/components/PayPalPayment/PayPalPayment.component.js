import React from 'react';

function PayPalPaymentAux({ value }) {
    const [paid, setPaid] = React.useState(false);
    const [error, setError] = React.useState(null);

    const paypalRef = React.useRef();

    React.useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Your description",
                            amount: {
                                currency_code: "BRL",
                                value: parseFloat(value),
                            },
                        },
                    ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    setPaid(true);
                    console.log(order);
                },
                onError: (err) => {
                    setError(err);
                    console.error(err);
                },
            })
            .render(paypalRef.current);
    }, [value]);

    // If the payment has been made
    if (paid) {
        return <div>Payment successful.!</div>;
    }

    // If any error occurs
    if (error) {
        return <div>Error Occurred in processing payment.! Please try again.</div>;
    }

    return (
        <div>
            <div ref={paypalRef} />
        </div>
    )
}

export default function PayPalPayment({ price }) {

    const [checkout, setCheckout] = React.useState(false);
    const [value, setValue] = React.useState(price);

    const spanWithValue = React.useRef();
    const inputWithValue = React.useRef();

    function changePrice(e) {
        e.preventDefault();

        spanWithValue.current.innerText = inputWithValue.current.value;
        setValue(inputWithValue.current.value);
    }

    return (
        <div className="payment-div">
            <PayPalPaymentAux
                value={value}
            />
        </div>
    );
}