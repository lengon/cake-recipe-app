import pandas as pd

df = pd.read_excel('brianrecipe.xlsx')
print('Shape:', df.shape)
print('Columns:', df.columns.tolist())
print('\nSample data (first row):')
for col in df.columns:
    val = str(df[col].iloc[0])
    print(f"[{col}]: {val[:150]}...")
