import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface BattleContextType {
  enemyCount: number;
  setEnemyCount: (count: number) => void;
  bossLife: number;
  setbossLife: Dispatch<SetStateAction<number>>;
  reset: () => void; // 追加
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [enemyCount, setEnemyCount] = useState(1);
  const [bossLife, setbossLife] = useState(5); // デフォルトのボスライフを10に設定

  // reset関数を追加
  const reset = () => {
    setEnemyCount(1);
    setbossLife(5);
  };

  return (
    <BattleContext.Provider
      value={{
        enemyCount,
        setEnemyCount,
        bossLife,
        setbossLife,
        reset, // 追加
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = () => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error("useBattleContext must be used within a BattleProvider");
  }
  return context;
};
