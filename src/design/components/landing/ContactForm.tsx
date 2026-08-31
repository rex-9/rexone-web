import React, { useState } from "react";
import { LANDING_DATA } from "../../pages/landing.data";
import { Button } from "../button";
import { FormContainer, TextInput, TextArea } from "../form";
import { colors } from "../../elements";
import {
  FormVariants,
  InputVariants,
  ButtonVariants,
  ButtonTypes,
  ComponentSizes,
} from "../../constants";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  return (
    <FormContainer
      variant={FormVariants.GLASS}
      action={LANDING_DATA.formspreeUrl}
      method="POST"
      target="_blank"
      rel="noopener noreferrer"
      className="font-primary w-[440px] max-w-[92vw] space-y-4"
    >
      <h2
        style={{
          textShadow: colors.effects.headingGlow,
        }}
        className="text-center font-display text-[28px] text-glow-white mb-2"
      >
        Keep in Touch
      </h2>

      <div className="w-full">
        <TextInput
          variant={InputVariants.GLASS}
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kindly enter your Full Name"
          required
        />
      </div>

      <div className="w-full">
        <TextInput
          variant={InputVariants.GLASS}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Kindly enter your Email"
          required
        />
      </div>

      <div className="w-full">
        <TextArea
          variant={InputVariants.GLASS}
          name="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="How can I kindly help you?"
          required
          rows={3}
          autoExpand={false}
          className="resize-y"
        />
      </div>

      <div className="pt-2">
        <Button
          variant={ButtonVariants.PRIMARY}
          type={ButtonTypes.SUBMIT}
          size={ComponentSizes.MD}
          className="!px-7 !py-3 text-[15px]"
        >
          Submit
        </Button>
      </div>
    </FormContainer>
  );
};
