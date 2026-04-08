import { motion } from "framer-motion";

export default function LoadingScreen() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  const dotVariants = {
    initial: { y: 0, opacity: 0.4 },
    animate: {
      y: [-10, 10, -10],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-b from-[#FFCA68] to-[#202C39]"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div
          className="flex flex-col items-center gap-2"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <h3
            className="text-lg font-medium text-jet"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Chargement
          </h3>
          <p className="text-sm text-jet/40">Vérification de votre compte...</p>
        </motion.div>

        {/* Animated underline */}
        <motion.div
          className="h-1 bg-gradient-to-r from-[#FFCA68] to-transparent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
