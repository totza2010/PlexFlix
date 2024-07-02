import Footer from "components/Footer/Footer";
import Navigation from "components/Navigation/Navigation";
import { motion } from "framer-motion";
import { framerTabVariants } from "src/utils/helper";
import { DetailsWrapper, Wrapper } from "./LayoutStyles";

const Layout = ({ children, className }) => {

  return (
    <Wrapper
      as={motion.main}
      variants={framerTabVariants}
      initial='hidden'
      animate='visible'
      exit='hidden'
      transition={{ duration: 0.5 }}
      className={className}>
      <DetailsWrapper className='flex flex-col justify-between'>
        <Navigation />
        <div className='grow content-wrapper'>{children}</div>
        <Footer />
      </DetailsWrapper>
    </Wrapper>
  );
};

export default Layout;
