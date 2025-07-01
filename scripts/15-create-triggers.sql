-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at em todas as tabelas
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_setores_updated_at BEFORE UPDATE ON setores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_turnos_updated_at BEFORE UPDATE ON turnos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_epis_updated_at BEFORE UPDATE ON epis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entrega_epis_updated_at BEFORE UPDATE ON entrega_epis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treinamentos_updated_at BEFORE UPDATE ON treinamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rel_treinamentos_funcionarios_updated_at BEFORE UPDATE ON rel_treinamentos_funcionarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_absenteismo_updated_at BEFORE UPDATE ON absenteismo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_acidentes_updated_at BEFORE UPDATE ON acidentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dds_updated_at BEFORE UPDATE ON dds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresa_updated_at BEFORE UPDATE ON empresa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
