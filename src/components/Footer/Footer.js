import { memo } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FiLinkedin } from "react-icons/fi";
import {
  FooterAttribute,
  FooterBranding,
  FooterWrapper,
  SocialIcons,
  SocialIconsContainer
} from "./FooterStyles";

const Footer = () => {
  return (
    <FooterWrapper className='flex justify-between items-center'>
      <FooterBranding>PlexFlix</FooterBranding>
      <SocialIconsContainer>
        <SocialIcons
          href='https://www.themoviedb.org'
          target='_blank'
          rel='noreferrer'
          aria-label='TMDB link'>
          <FooterAttribute />
        </SocialIcons>

        <SocialIcons
          href='https://github.com/totza2010'
          target='_blank'
          rel='noreferrer'
          aria-label='github link'>
          <AiFillGithub size='2rem' />
        </SocialIcons>

        <SocialIcons
          href='https://www.linkedin.com/in/totza2010'
          target='_blank'
          rel='noreferrer'
          aria-label='linkedin link'>
          <FiLinkedin size='2rem' />
        </SocialIcons>
      </SocialIconsContainer>
    </FooterWrapper>
  );
};

export default memo(Footer);
